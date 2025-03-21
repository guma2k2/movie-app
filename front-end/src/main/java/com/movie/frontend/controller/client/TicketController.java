package com.movie.frontend.controller.client;

import com.movie.frontend.model.JwtToken;
import com.movie.frontend.model.TicketDTO;
import com.movie.frontend.model.VNPayResponse;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.TicketService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Controller
@RequestMapping("/tickets")
@Slf4j
public class TicketController {


    @Autowired
    private TicketService ticketService;


    @GetMapping("/vn-pay-callback")
    public String callbackPayment(
            @RequestParam("vnp_OrderInfo") String bookingId,
            @RequestParam("vnp_ResponseCode") String code,
            @RequestParam("vnp_BankCode") String vnp_BankCode,
            HttpSession session
    ) {
        if (code.equals("00")) {
            String jwt = Utility.getJwt(session) ;
            Long userId = ((JwtToken) session.getAttribute("jwtToken")).getUser().getId();
            // API : CREATE_TICKET
            try {
                ticketService.createTicket(userId, Long.parseLong(bookingId), vnp_BankCode ,jwt, session);
            } catch (JwtExpirationException e) {
                throw new RuntimeException(e);
            }
            return "client/success";
        }
        return "client/failure";
    }

    @PostMapping("/create")
    public String createTicket(
       @RequestParam("banking") String banking ,
       @RequestParam("totalPrice") Integer totalPrice ,
       HttpServletRequest servletRequest,
       HttpSession session
    ) {
        try {
            String jwt = Utility.getJwt(session) ;
            if (jwt.equals("")) {
                return "redirect:/login";
            }
            Long eventId = Long.valueOf(servletRequest.getParameter("eventId"));
            Long bookingId = Long.valueOf(servletRequest.getParameter("bookingId"));

            log.info(String.valueOf(eventId));
            log.info(String.valueOf(totalPrice));

            if (bookingId == null) {
                return "redirect:/booking/" + eventId ;
            }
            VNPayResponse res = ticketService.callbackPayment(totalPrice, bookingId, banking, jwt, session);
            log.info(res.paymentUrl());
            return "redirect:" + res.paymentUrl();

        } catch (HttpClientErrorException e) {
            log.error("err: {}" , e.getMessage());
            return "redirect:/";
        } catch (JwtExpirationException e) {
            return "redirect:/login";
        }
    }
    @GetMapping("/history")
    public String historyBookingTicket(HttpSession session ,
                                       Model model ) {
        try {
            String jwt = Utility.getJwt(session) ;
            if (jwt.equals("")) {
                return "redirect:/login";
            }

            Long userId = ((JwtToken) session.getAttribute("jwtToken")).getUser().getId();
            log.info(jwt);
            log.info(userId.toString());
            List<TicketDTO> tickets = ticketService.findByUserId(jwt, userId, session) ;
            model.addAttribute("token" , jwt);
            model.addAttribute("tickets",tickets);
            return "client/ticket-history" ;
        } catch (HttpClientErrorException e) {
            return "redirect:/login";
        } catch (JwtExpirationException e) {
            return "redirect:/login";
        }
    }
}
