package com.movie.frontend.service;

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
public class CityService {
    public List<CityDTO> findAll(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_CITIES;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<CityDTO[]> response = Utility.body(api , HttpMethod.GET , request , CityDTO[].class , session);
        return Arrays.stream(response.getBody()).toList();
    }
}
