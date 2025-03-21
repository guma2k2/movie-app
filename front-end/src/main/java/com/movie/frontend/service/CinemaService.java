package com.movie.frontend.service;

import com.movie.frontend.model.CinemaDTO;
import com.movie.frontend.model.CityDTO;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class CinemaService {

    public List<CinemaDTO> findAll(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_CINEMAS;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<CinemaDTO[]> response = Utility.body(api , HttpMethod.GET , request , CinemaDTO[].class , session);
        return Arrays.stream(response.getBody()).toList();
    }
    public List<CityDTO> listCity(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_CITES ;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<CityDTO[]> response = Utility.body(api , HttpMethod.GET , request , CityDTO[].class , session);
        return Arrays.stream(response.getBody()).toList();
    }
}
