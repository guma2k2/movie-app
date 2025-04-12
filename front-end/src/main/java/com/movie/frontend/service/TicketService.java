package com.movie.frontend.service;

import com.movie.frontend.model.PaymentRequestVM;
import com.movie.frontend.model.TicketDTO;
import com.movie.frontend.model.VNPayResponse;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class TicketService {

    public void createTicket(Long userId, Long bookingId, String bank ,String token, HttpSession session) throws JwtExpirationException {
        TicketDTO ticket = new TicketDTO();
        ticket.setUserId(userId);
        ticket.setBookingId(bookingId);
        ticket.setBank(bank);
        String createTicketURL = Apis.API_CREATE_TICKET;
        HttpEntity<?> httpEntity = Utility.getHeaderWithJwtAndObject(token, ticket) ;
        HttpEntity<String> response = Utility.body(createTicketURL, HttpMethod.POST, httpEntity, String.class, session);
    }
    
    public VNPayResponse callbackPayment(int ammount, Long bookingId, String bankCode, String token, HttpSession session) throws JwtExpirationException {
        PaymentRequestVM request = new PaymentRequestVM(ammount, bankCode, bookingId);
        String urlCallBack = Apis.API_CALLBACK_PAYMENT;
        HttpEntity<?> httpEntity = Utility.getHeaderWithJwtAndObject(token, request) ;
        HttpEntity<VNPayResponse> response = Utility.body(urlCallBack, HttpMethod.POST, httpEntity, VNPayResponse.class, session);
        return response.getBody();
    }

    public List<TicketDTO> findByUserId(String token, Long userId, HttpSession session) throws JwtExpirationException {
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        String getTicketsByUserId = Apis.API_GET_TICKETS_BY_USER_ID;
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(getTicketsByUserId)
                .uriVariables(Collections.singletonMap("id", userId));

        ResponseEntity<TicketDTO[]> response = Utility.body(builder.toUriString(), HttpMethod.GET,request ,TicketDTO[].class,session );
//            log.info(String.valueOf(response.getStatusCode()));

        TicketDTO[] ticketDTOS = response.getBody();
        List<TicketDTO> tickets = Arrays.asList(ticketDTOS);
        return tickets;
    }
}
