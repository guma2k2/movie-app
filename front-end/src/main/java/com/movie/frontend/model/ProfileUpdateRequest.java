package com.movie.frontend.model;

public record ProfileUpdateRequest(
        String firstName,
        String lastName,
        String phoneNumber,
        String password
) {
}
