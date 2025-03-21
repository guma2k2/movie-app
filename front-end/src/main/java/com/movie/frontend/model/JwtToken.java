package com.movie.frontend.model;

import lombok.Data;

@Data
public class JwtToken {

    private String access_token;
    private String refresh_token;
    private UserDTO user ;
}
