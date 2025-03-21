package com.movie.frontend.utility;


import com.movie.frontend.model.ChatMessage;
import com.movie.frontend.model.ChatSeatType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
public class WebSocketEventListener {

    @Autowired
    private  SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        Long eventId = (Long) headerAccessor.getSessionAttributes().get("eventId");
        if (username != null) {
            log.info("user disconnected: {}", username);
            log.info("in Event: {}", eventId);
            var chatMessage = ChatMessage.builder()
                    .type(ChatSeatType.LEAVE)
                    .sender(username)
                    .build();
            messagingTemplate.convertAndSend("/topic/event/" + eventId, chatMessage);
        }
    }
}
