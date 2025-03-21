package com.movie.frontend.model;

import lombok.Data;

import java.util.List;

@Data
public class RoomDTO {
    private Long id ;
    private String name ;
    private String capacity ; // 10x10 : columns X rows
    private String cinemaName ;
    private List<SeatDTO> seats ;

    private CinemaDTO cinema;
}
