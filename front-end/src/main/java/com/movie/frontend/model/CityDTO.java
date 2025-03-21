package com.movie.frontend.model;

import lombok.Data;

import java.util.List;

@Data
public class CityDTO {
    private Integer id ;
    private String name ;
    private List<CinemaDTO> cinemas ;
}
