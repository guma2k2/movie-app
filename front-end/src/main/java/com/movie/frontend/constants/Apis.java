package com.movie.frontend.constants;


import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Apis {


//    private static String base_url = "http://backend-movie:8080/api/v1";
//    private static String base_url = "http://localhost:8080/api/v1";

//    @Value("${api.url}")
//    public static String base_url;
//    public static String API_VERIFY_CODE = base_url+ "/auth/verify";
//    public static String API_SAVE_SETTING = base_url+ "/admin/setting/save";
//    public static String API_VERIFY_PASSWORD = base_url+ "/auth/verifyPassword";
//    public static String API_RESET_PASSWORD = base_url+ "/auth/resetPassword";
//    public static String API_OUTBOUND_USER = base_url+ "/auth/outbound/authentication";
//
//    public static String API_CONFIRM_PASSWORD = base_url+ "/auth/confirmPassword/{token}";
//    public static String API_GET_MOVIES_IS_SHOWING = base_url+ "/movies/is/showing";
//    public static String API_GET_MOVIES_FIRST_PAGE = base_url+ "/admin/movie/paginate/firstPage";
//    public static String API_GET_BOOKINGS_FIRST_PAGE = base_url+ "/admin/bookings/paginate?pageNum=1";
//    public static String API_GET_BOOKING_DETAIL = base_url+ "/admin/bookings/";
//    public static String API_GET_USERS_FIRST_PAGE = base_url+ "/admin/user/paginate/firstPage";
//    public static String API_GET_GENRES = base_url+ "/admin/movie/genres";
//    public static String API_GET_CINEMAS = base_url+ "/admin/cinema";
//    public static String API_GET_ROOMS = base_url+ "/admin/room";
//    public static String API_GET_ROOM_BY_ID = base_url+ "/admin/room/{id}";
//    public static String API_AUTH_REFRESH_TOKEN = base_url+ "/auth/refresh-token" ;
//    public static String API_GET_MOVIES_WILL_SHOWING = base_url+ "/movies/will/showing";
//    public static  String API_GET_CITES = base_url +"/movies/cities";
//    public static  String API_GET_SETTINGS = base_url +"/admin/setting";
//    public static String API_GET_TICKETS_BY_USER_ID = base_url+  "/ticket/user/{id}";
//    public static String API_CREATE_TICKET =  base_url + "/ticket/create" ;
//    public static String API_CALLBACK_PAYMENT =  base_url + "/ticket/vn-pay" ;
//    public static String API_AUTH_REGISTER = base_url +  "/auth/register";
//    public static String API_AUTH_LOGIN = base_url+ "/auth/authenticate";
//    public static String API_AUTH_PROFILE = base_url+ "/auth/profile";
//    public static String API_AUTH_INFO_PROFILE = base_url+ "/auth/profile";
//    public static String API_AUTH_LOGOUT = base_url+"/auth/logout";
//    public static String API_GET_MOVIES = base_url + "/movies";
//    public static String APT_GET_MOVIE_BY_ID =  base_url +  "/movies/{id}";
//    public static String API_EVENT_BY_ID =  base_url +  "/movies/events/booking/{id}";
//    public static String API_GET_ALL_COMBO = base_url+ "/movies/combos";
//    public static String API_CREATE_BOOKING =  base_url+  "/create/booking";



    @Value("${api.url}")
    private String baseUrl;

    public static String BASE_URL;
    public static String API_VERIFY_CODE;
    public static String API_SAVE_SETTING;
    public static String API_VERIFY_PASSWORD;
    public static String API_RESET_PASSWORD;
    public static String API_OUTBOUND_USER;

    public static String API_CONFIRM_PASSWORD;
    public static String API_GET_MOVIES_IS_SHOWING;
    public static String API_GET_MOVIES_FIRST_PAGE;
    public static String API_GET_BOOKINGS_FIRST_PAGE;
    public static String API_GET_BOOKING_DETAIL;
    public static String API_GET_USERS_FIRST_PAGE;
    public static String API_GET_GENRES;
    public static String API_GET_CINEMAS;
    public static String API_GET_ROOMS;
    public static String API_GET_ROOM_BY_ID;
    public static String API_AUTH_REFRESH_TOKEN;
    public static String API_GET_MOVIES_WILL_SHOWING;
    public static String API_GET_CITIES;
    public static String API_GET_SETTINGS;
    public static String API_GET_TICKETS_BY_USER_ID;
    public static String API_CREATE_TICKET;
    public static String API_CALLBACK_PAYMENT;
    public static String API_AUTH_REGISTER;
    public static String API_AUTH_LOGIN;
    public static String API_AUTH_PROFILE;
    public static String API_AUTH_INFO_PROFILE;
    public static String API_AUTH_LOGOUT;
    public static String API_GET_MOVIES;
    public static String API_GET_MOVIE_BY_ID;
    public static String API_EVENT_BY_ID;
    public static String API_GET_ALL_COMBO;
    public static String API_CREATE_BOOKING;

    @PostConstruct
    public void init() {
        BASE_URL = baseUrl;
        API_VERIFY_CODE = BASE_URL + "/auth/verify";
        API_SAVE_SETTING = BASE_URL + "/admin/setting/save";
        API_VERIFY_PASSWORD = BASE_URL + "/auth/verifyPassword";
        API_RESET_PASSWORD = BASE_URL + "/auth/resetPassword";
        API_OUTBOUND_USER = BASE_URL + "/auth/outbound/authentication";

        API_CONFIRM_PASSWORD = BASE_URL + "/auth/confirmPassword/{token}";
        API_GET_MOVIES_IS_SHOWING = BASE_URL + "/movies/is/showing";
        API_GET_MOVIES_FIRST_PAGE = BASE_URL + "/admin/movie/paginate/firstPage";
        API_GET_BOOKINGS_FIRST_PAGE = BASE_URL + "/admin/bookings/paginate?pageNum=1";
        API_GET_BOOKING_DETAIL = BASE_URL + "/admin/bookings/";
        API_GET_USERS_FIRST_PAGE = BASE_URL + "/admin/user/paginate/firstPage";
        API_GET_GENRES = BASE_URL + "/admin/movie/genres";
        API_GET_CINEMAS = BASE_URL + "/admin/cinema";
        API_GET_ROOMS = BASE_URL + "/admin/room";
        API_GET_ROOM_BY_ID = BASE_URL + "/admin/room/{id}";
        API_AUTH_REFRESH_TOKEN = BASE_URL + "/auth/refresh-token";
        API_GET_MOVIES_WILL_SHOWING = BASE_URL + "/movies/will/showing";
        API_GET_CITIES = BASE_URL + "/movies/cities";
        API_GET_SETTINGS = BASE_URL + "/admin/setting";
        API_GET_TICKETS_BY_USER_ID = BASE_URL + "/ticket/user/{id}";
        API_CREATE_TICKET = BASE_URL + "/ticket/create";
        API_CALLBACK_PAYMENT = BASE_URL + "/ticket/vn-pay";
        API_AUTH_REGISTER = BASE_URL + "/auth/register";
        API_AUTH_LOGIN = BASE_URL + "/auth/authenticate";
        API_AUTH_PROFILE = BASE_URL + "/auth/profile";
        API_AUTH_INFO_PROFILE = BASE_URL + "/auth/profile";
        API_AUTH_LOGOUT = BASE_URL + "/auth/logout";
        API_GET_MOVIES = BASE_URL + "/movies";
        API_GET_MOVIE_BY_ID = BASE_URL + "/movies/{id}";
        API_EVENT_BY_ID = BASE_URL + "/movies/events/booking/{id}";
        API_GET_ALL_COMBO = BASE_URL + "/movies/combos";
        API_CREATE_BOOKING = BASE_URL + "/create/booking";
    }
}
