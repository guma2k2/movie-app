package com.movie.frontend.controller.client;


import com.movie.frontend.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ChatController {

    @MessageMapping("/chat/{eventId}/sendMessage")
    @SendTo("/topic/event/{eventId}")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        log.info(chatMessage.getSender());
        return chatMessage ;
    }


    @MessageMapping("/chat/{eventId}/add")
    @SendTo("/topic/event/{eventId}")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor,
            @DestinationVariable("eventId") Long eventId
    ) {
        // Add username in web socket session
        log.info(chatMessage.getSender() + " joined");
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("eventId", eventId);
        return chatMessage;
    }
}
