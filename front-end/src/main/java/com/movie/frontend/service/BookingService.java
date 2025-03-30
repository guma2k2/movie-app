package com.movie.frontend.service;


import com.movie.frontend.model.*;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    public Long saveBooking(BookingDTO booking, String token, HttpSession session) throws JwtExpirationException {
        String createBookingURL = Apis.API_CREATE_BOOKING;
        HttpEntity<?> httpEntity = Utility.getHeaderWithJwtAndObject(token, booking) ;
        ResponseEntity<Long> responseEntity = Utility.body(createBookingURL, HttpMethod.POST, httpEntity,Long.class,session );
        return responseEntity.getBody() ;
    }

    public BookingDTO setBooking(EventDTO event, String seats, Long totalPrice, List<ComboDTO> usedCombo, UserDTO userDTO) {
        BookingDTO booking = new BookingDTO();
        booking.setCreated_time(LocalDateTime.now());
        booking.setSeats(seats);
        booking.setEvent(event);
        booking.setTotal_amount(totalPrice);
        booking.setCombos(usedCombo);
        booking.setUser(userDTO);
        return booking ;
    }

    public DataContent<BookingDTO> findAll(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_BOOKINGS_FIRST_PAGE;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<DataContent> response = Utility.body(api , HttpMethod.GET , request , DataContent.class , session);
        return response.getBody();
    }

    public BookingDTO findById(HttpSession session, Long bookingId) throws JwtExpirationException {
        String api = Apis.API_GET_BOOKING_DETAIL + bookingId;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<BookingDTO> response = Utility.body(api , HttpMethod.GET , request , BookingDTO.class , session);
        return response.getBody();
    }

}
