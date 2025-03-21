package com.movie.frontend.model;

import lombok.Data;

import java.util.List;

@Data
public class TicketDTO {
    private Long id ;

    private String qrCode ;

    private EventDTO event ;
    private String stk;
    private Long userId ;
    private Long bookingId ;
    private List<BookingComboDTO> combos ;
    private String seats ;
    private Long totalAmount ;

    private String phoneNumber;
    private String bank;
    private String createdAt;
}
