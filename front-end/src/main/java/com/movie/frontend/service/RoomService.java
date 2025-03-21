package com.movie.frontend.service;

import com.movie.frontend.model.DataContent;
import com.movie.frontend.model.RoomDTO;
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
public class RoomService
{
    public DataContent findAllPaginate(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_ROOMS;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<DataContent> response = Utility.body(api , HttpMethod.GET , request , DataContent.class , session);
        return response.getBody();
    }

    public RoomDTO get(Long roomId,
                       HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_ROOM_BY_ID;
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(api)
                .uriVariables(Collections
                        .singletonMap("id", roomId));
        String url = builder.toUriString() ;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<RoomDTO> response = Utility.body(url , HttpMethod.GET , request , RoomDTO.class , session);
        return response.getBody() ;

    }
}
