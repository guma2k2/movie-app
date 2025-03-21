package com.movie.frontend.model;

import lombok.Data;

@Data
public class BookingSeatDTO {
    private Long id ;
    private BookingDTO booking ;

    private SeatDTO seat ;

    private EventDTO event ;

    public BookingSeatDTO() {
    }
}
