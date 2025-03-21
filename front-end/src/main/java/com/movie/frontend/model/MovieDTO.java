package com.movie.frontend.model;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MovieDTO {
    private Long id ;
    private String title ;
    private String description;
    private int duration_minutes;
    private LocalDate release_date;
    private LanguageDTO language ;
    private RatingDTO rating;
    private String director ;
    private String cast ;
    private boolean isShowing ;
    private String poster_url ;
    private String trailer ;
    private String photosImagePath;
    private Set<GenreDTO> genres;
}
