package com.movie.frontend.service;

import com.movie.frontend.model.EventDTO;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;

@Service
public class EventService {

    public EventDTO getById(Long eventId, HttpEntity<?> request, HttpSession session) throws JwtExpirationException {
        String getEventByIdURL = Apis.API_EVENT_BY_ID;

        // map event id to link api
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(getEventByIdURL)
                .uriVariables(Collections
                        .singletonMap("id", eventId));

        ResponseEntity<EventDTO> entity = Utility.body(builder.toUriString(), HttpMethod.GET, request, EventDTO.class ,session);
        EventDTO event = entity.getBody() ;
        return event ;
    }
}
