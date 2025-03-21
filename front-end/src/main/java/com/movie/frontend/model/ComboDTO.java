package com.movie.frontend.model;

import lombok.Data;

@Data
public class ComboDTO {
    private Long id ;
    private String title ;
    private String description ;
    private Integer price ;
    private String img_url;

    private int quantity ;

}
