package com.movie.frontend.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventDTO {
    private Long id ;

    private SubtitleTypeDTO subtitleType ;
    private LocalDate start_date;

    private String start_time;
    private RoomDTO room ;

    private MovieDTO movie ;

    private String cinemaName ;

    private Integer price ;

    private String endTime ;
    private String startTime;



}
