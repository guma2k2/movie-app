package com.movie.frontend.exception;

public class JwtExpirationException extends Exception {
    public JwtExpirationException(String message) {
        super(message);
    }
}
