package com.movie.frontend.model;

public record PaymentRequestVM(
        int amount,
        String bankCode,
        Long bookingId
) {
}
