package com.movie.frontend.model;

public record VNPayResponse( String code,
                             String message,
                             String paymentUrl) {
}
