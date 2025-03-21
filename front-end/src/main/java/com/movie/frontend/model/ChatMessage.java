package com.movie.frontend.model;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String sender;
    private String seats ;
    private ChatSeatType type;
}
