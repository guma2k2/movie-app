package com.movie.frontend.service;


import com.movie.frontend.model.Setting;
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
public class SettingService {
    public List<Setting> findAll(HttpSession session) throws JwtExpirationException {
        String api = Apis.API_GET_SETTINGS;
        String token = Utility.getJwt(session) ;
        HttpEntity<?> request = Utility.getHeaderWithJwt(token) ;
        ResponseEntity<Setting[]> response = Utility.body(api , HttpMethod.GET , request , Setting[].class , session);
        return Arrays.stream(response.getBody()).toList();
    }
    public String saveSetting(List<Setting> settings, String token, HttpSession session) throws JwtExpirationException {
        String saveSetting = Apis.API_SAVE_SETTING;
        HttpEntity<?> httpEntity = Utility.getHeaderWithJwtAndObject(token, settings) ;
        ResponseEntity<String> responseEntity = Utility.body(saveSetting, HttpMethod.POST, httpEntity,String.class,session );
        return responseEntity.getBody() ;
    }
}
