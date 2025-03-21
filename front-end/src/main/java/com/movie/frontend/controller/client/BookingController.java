package com.movie.frontend.controller.client;

import com.movie.frontend.model.*;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.BookingService;
import com.movie.frontend.service.ComboService;
import com.movie.frontend.service.EventService;
import com.movie.frontend.service.SeatService;
import com.movie.frontend.utility.CurrencyUtil;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@Slf4j
@RequestMapping("/")
public class BookingController {

    @Autowired
    private SeatService seatService ;

    @Autowired
    private EventService eventService ;

    @Autowired
    private ComboService comboService ;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/booking/{eventId}")
    public String BookingSite(@PathVariable("eventId") Long id ,
                              Model model ,
                              HttpSession session ,
                              HttpServletRequest servletRequest ,
                              HttpServletResponse servletResponse ,
                              RedirectAttributes redirectAttributes) {
        try {
            String jwt = Utility.getJwt(session) ;
            if (jwt.equals("")) {
                return "redirect:/login";
            }
//            log.info(jwt);
            HttpEntity<?> request = Utility.getHeaderWithJwt(jwt) ;
            //get event by event id
            EventDTO event = eventService.getById(id, request, session) ;

            // get room and return list seat to display the client
            RoomDTO room = event.getRoom() ;

            // get list of seat by room
            List<SeatDTO> seats = room.getSeats() ;



            // get combo with send request with method get and return
            ComboDTO[] combos = comboService.getCombos();

            // get a number row of room
            int row_num = Integer.parseInt(room.getCapacity().split("x")[0]) ;

            // get a number column of room
            int col_num = Integer.parseInt(room.getCapacity().split("x")[1]) ;

            // get length of room
            int lengthOfRoom = room.getSeats().size();

            // get the number of the different seat type
            List<String> types = seatService.getDifferentTypeOfListSeat(seats) ;
            int remainSeat = seatService.checkRemainSeats(seats) ;
            // check if no remain seat return page `full_slot` view
            if (remainSeat == 0) {
                return "client/booking-fail";
            }

            // set list of seat was not in room and set those seats are empty status
            seatService.setListSeat(seats, row_num, col_num);


            model.addAttribute("types"  , types);
            model.addAttribute("event" , event );
            model.addAttribute("combos" , combos);
            model.addAttribute("seats" , seats) ;
            model.addAttribute("row_num" , row_num) ;
            model.addAttribute("col_num" , col_num) ;
            model.addAttribute("lengthOfRoom" , lengthOfRoom);
            model.addAttribute("remainSeat" , remainSeat);
            return "client/booking" ;
        } catch (HttpClientErrorException e) {
            redirectAttributes.addAttribute("eventId", id);
            return "redirect:/login";
        } catch (JwtExpirationException e) {
            return "redirect:/login";
        }

        // list event by id

    }

    @PostMapping("/booking/create")
    public String createBooking(
            @RequestParam("seats") String seats,
            @RequestParam("eventId") Long eventId ,
            @RequestParam("totalPrice") Long totalPrice,
            HttpSession session ,
            Model model ,
            HttpServletRequest servletRequest ,
            RedirectAttributes redirectAttributes
    ) {
//        log.info(seats);
//        log.info(String.valueOf(eventId));
//        log.info(String.valueOf(totalPrice));
        try {
            RestTemplate restTemplate = new RestTemplate() ;
            String jwt = Utility.getJwt(session) ;
            if (jwt.equals("")) {
                return "redirect:/login";
            }
            HttpEntity<?> request = Utility.getHeaderWithJwt(jwt) ;
            //get event by event id
            EventDTO event = eventService.getById(eventId, request, session) ;

            // set List comboDTO to save booking
            List<ComboDTO> usedCombo= comboService.setListCombo(servletRequest);

            // get user from session
            UserDTO user = ((JwtToken) session.getAttribute("jwtToken")).getUser();


            //save bookings
            log.info(totalPrice.toString());
            String formattedPrice = CurrencyUtil.formatToVND(totalPrice);
            BookingDTO booking = bookingService.setBooking(event, seats, totalPrice,usedCombo, user);

            // get booking id when create success booking
            Long bookingId = bookingService.saveBooking(booking,jwt, session) ;

            model.addAttribute("event" , event);
            model.addAttribute("seats" ,seats );
            model.addAttribute("totalPrice" , totalPrice);
            model.addAttribute("formattedPrice" , formattedPrice);
            model.addAttribute("bookingId" , bookingId);
            model.addAttribute("token" , jwt);
            return "client/ticket" ;
        } catch (HttpClientErrorException e) {
//            log.info(e.getStatusText());
            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403){
                return "redirect:/login";
            }else {
                redirectAttributes.addFlashAttribute("error", e.getResponseBodyAsString());
                log.error( "err : {}", e.getResponseBodyAsString());
                return "redirect:/booking/" + eventId;
            }
        } catch (JwtExpirationException e) {
            return "redirect:/login";
        }


    }
}
