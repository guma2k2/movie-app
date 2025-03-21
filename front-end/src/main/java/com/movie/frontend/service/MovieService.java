package com.movie.frontend.service;

import com.movie.frontend.model.DataContent;
import com.movie.frontend.model.GenreDTO;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    public DataContent findAll(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_MOVIES_FIRST_PAGE;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<DataContent> response = Utility.body(api , HttpMethod.GET , request , DataContent.class , session);
        return response.getBody();
    }

    public List<GenreDTO> findAllGenre(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_GENRES;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<GenreDTO[]> response = Utility.body(api , HttpMethod.GET , request , GenreDTO[].class , session);
        return List.of(response.getBody());
    }
}
