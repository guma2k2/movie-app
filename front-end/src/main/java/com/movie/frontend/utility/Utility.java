package com.movie.frontend.utility;

import com.movie.frontend.model.JwtToken;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

public class Utility {

    public static HttpEntity<?> getHeaderWithJwt(String token) {
        // Configure header with jwt to call API
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.ACCEPT , MediaType.APPLICATION_JSON_VALUE);
        httpHeaders.set(HttpHeaders.AUTHORIZATION ,"Bearer "+ token);
        HttpEntity<?> request = new HttpEntity<>(httpHeaders);
        return request;
    }

    public static HttpEntity<?> getHeaderWithJwtAndObject(String token, Object object) {
        // Configure header with jwt to call API and extract object to request
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.ACCEPT , MediaType.APPLICATION_JSON_VALUE);
        httpHeaders.set(HttpHeaders.AUTHORIZATION ,"Bearer "+token);
        HttpEntity<?> request = new HttpEntity<>(object, httpHeaders);
        return request;
    }
    public static String getJwt(HttpSession session) {

        // Get jwt from session which was set when user login success
        JwtToken jwtToken = (JwtToken) session.getAttribute("jwtToken");
        String token = "" ;
        if(jwtToken != null) {
            if(jwtToken.getAccess_token() != null) {
                token = jwtToken.getAccess_token();
            }
        }
        return  token ;
    }

    public static String getRefreshToken(HttpSession session) {
        // Get refresh token from session which was set when user login success
        JwtToken jwtToken = (JwtToken) session.getAttribute("jwtToken");
        String token = "" ;
        if(jwtToken.getAccess_token() != null) {
            token = jwtToken.getRefresh_token();
        }
        return  token ;
    }

    public static <T> ResponseEntity<T> body(String url , HttpMethod method , HttpEntity<?> request , Class<T> responseType , HttpSession session) throws JwtExpirationException {
        RestTemplate restTemplate = new RestTemplate() ;
        String refreshToken = getRefreshToken(session) ;
        JwtToken jwtToken = null ;
        ResponseEntity<T> response = restTemplate.exchange(url , method , request , responseType) ;

        // Handle when jwt is expired , then use refresh token
        if(response.getStatusCode().value() == 401) {
            HttpEntity<?> newRequest = getHeaderWithJwt(refreshToken) ;
            String API_GetNewAccessToken = Apis.API_AUTH_REFRESH_TOKEN;
            ResponseEntity<JwtToken> getNewJwt = restTemplate.exchange(API_GetNewAccessToken, HttpMethod.GET,newRequest,JwtToken.class) ;
            if(getNewJwt.getStatusCode().value() == 403) {
                throw new JwtExpirationException("jwt was not valid") ;
            }else {
                jwtToken = getNewJwt.getBody() ;
                session.setAttribute("jwtToken" , jwtToken);
                request = Utility.getHeaderWithJwt(jwtToken.getAccess_token());
            }
        }else {
            return response;
        }
        ResponseEntity<T> responseWithRefreshToken = restTemplate.exchange(url , method , request , responseType) ;
        return responseWithRefreshToken;
    }
}
