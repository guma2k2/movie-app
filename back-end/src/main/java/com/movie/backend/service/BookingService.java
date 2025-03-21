package com.movie.backend.service;

import com.movie.backend.dto.BookingComboDTO;
import com.movie.backend.dto.BookingDTO;
import com.movie.backend.dto.ComboDTO;
import com.movie.backend.entity.*;
import com.movie.backend.exception.BookingException;
import com.movie.backend.exception.EventValidException;
import com.movie.backend.exception.UserException;
import com.movie.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class BookingService {

    @Autowired
    private SeatService seatService ;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;
    @Autowired
    private BookingComboRepository bookingComboRepository;

    @Autowired
    private UserRepository userRepository ;

    @Autowired
    private EventRepository eventRepository;


    @Autowired
    private ModelMapper modelMapper ;
    public Long createBooking(BookingDTO bookingDTO) throws BookingException {

        Long eventId = bookingDTO.getEvent().getId() ;
        String seats = bookingDTO.getSeats() ;
        String[] seatNames = seats.split(", ");

        // check booking with all the name of seat from client which sent the request
        for (String seatName : seatNames) {
            if(seatService.checkPaidBooking(eventId , seatName)) {
                throw new BookingException("Đã có người thanh toan , vui long đặt chỗ khác");
            }
            // handle quick booking than current user
            if(!seatService.checkValidBooking(eventId , seatName)) {
                throw new BookingException("Đã có người nhanh tay hơn bạn, bạn có thể đợi 5p hoặc đặt chỗ khác");
            }
            // handle quick booking than current user
        }
        // find all the entity was reference with booking include: user , event

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EventValidException("Id of event not found"));

        User user = userRepository.findById(bookingDTO.getUser().getId()).orElseThrow(() -> new UserException("Id of user not found"));

        // save booking
        Booking booking = Booking.builder()
                .user(user)
                .seats(seats)
                .total_amount(bookingDTO.getTotal_amount())
                .event(event)
                .created_time(bookingDTO.getCreated_time())
                .build();

        // handle  seat with  list seat from bookingDTO request
        List<Seat> seatList = seatRepository.findByNameRoom(seatNames,
                event.getRoom().getId() ) ;
        List<BookingSeat> bookingSeats = new ArrayList<>() ;
        seatList.forEach(seat -> {
            BookingSeat bookingSeat = BookingSeat
                    .builder()
                    .booking(booking)
                    .seat(seat)
                    .build();
            bookingSeats.add(bookingSeat);
        });

        // handle all combo with  list combo of bookingDTO from request
        List<ComboDTO> comboOnBooking = bookingDTO.getCombos();

        List<BookingCombo> bookingCombos = new ArrayList<>() ;
        comboOnBooking.forEach(comboDTO -> {
            Combo combo = modelMapper.map(comboDTO, Combo.class);
            BookingCombo bookingCombo = BookingCombo.builder()
                    .booking(booking)
                    .combo(combo)
                    .quantity(comboDTO.getQuantity())
                    .build();
            bookingCombos.add(bookingCombo);
        });

        // save to db
        Booking savedBooking = bookingRepository.save(booking);
        bookingSeatRepository.saveAll(bookingSeats);
        bookingComboRepository.saveAll(bookingCombos);
//        log.info(String.valueOf(booking.getId()));
        return savedBooking.getId();
    }

    // Clean up all booking request which was not click cancel booking (out of page)
    // This schedule run every 0.1s
    @Scheduled(fixedDelay = 100)
    public void scheduleFixedBookingRequest() {
        List<Booking> bookings = bookingRepository.findAllBookingByDay();
        LocalDateTime now = LocalDateTime.now();
        bookings.forEach(booking -> {
            LocalDateTime createdTimeOfBooking = booking.getCreated_time();
            Duration duration = Duration.between(createdTimeOfBooking, now);
            Long minutes = duration.toMinutes();
            if (minutes >= 5) {
                log.info("delete booking with id : {}" , booking.getId());
                deleteByBookingId(booking.getId());
            }
        });
    }

    public void deleteByBookingId(Long bookingId) {
        if(bookingId == null) {
            throw new BookingException("Cant get the id of booking");
        }
        bookingSeatRepository.deleteByBooking(bookingId);
        bookingComboRepository.deleteByBooking(bookingId);
        bookingRepository.deleteBookingById(bookingId);
    }
}
