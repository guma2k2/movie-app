package com.movie.frontend.model;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class CinemaDTO {
    private Long id ;
    private String name ;
    private String address ;
    private String image_url ;
    private String cinema_type ;
    private String phone_number ;
    private CityDTO city;
    private List<RoomDTO> rooms ;
    private Set<CinemaImageDTO> images;
}
