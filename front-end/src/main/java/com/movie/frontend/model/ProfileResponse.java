package com.movie.frontend.model;

public record ProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber
) {

}
