package com.movie.frontend.model;

import lombok.Data;

import java.time.LocalDate;


@Data
public class SalesByCinema {
    private Long cinemaId ;
    private String cinemaName ;
    private LocalDate date ;
    private Long totalAmount;
}
