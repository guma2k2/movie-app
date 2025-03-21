package com.movie.frontend.constants;


import org.springframework.beans.factory.annotation.Value;

public class Apis {


//    private static String base_url = "http://backend-movie:8082/api/v1";
    private static String base_url = "http://localhost:8080/api/v1";

    public static String API_VERIFY_CODE = base_url+ "/auth/verify";
    public static String API_SAVE_SETTING = base_url+ "/admin/setting/save";
    public static String API_VERIFY_PASSWORD = base_url+ "/auth/verifyPassword";
    public static String API_RESET_PASSWORD = base_url+ "/auth/resetPassword";
    public static String API_OUTBOUND_USER = base_url+ "/auth/outbound/authentication";

    public static String API_CONFIRM_PASSWORD = base_url+ "/auth/confirmPassword/{token}";
    public static String API_GET_MOVIES_IS_SHOWING = base_url+ "/movies/is/showing";
    public static String API_GET_MOVIES_FIRST_PAGE = base_url+ "/admin/movie/paginate/firstPage";
    public static String API_GET_ROLES = base_url+ "/admin/user/roles" ;
    public static String API_GET_USERS_FIRST_PAGE = base_url+ "/admin/user/paginate/firstPage";
    public static String API_GET_GENRES = base_url+ "/admin/movie/genres";
    public static String API_GET_CINEMAS = base_url+ "/admin/cinema";
    public static String API_GET_ROOMS = base_url+ "/admin/room";
    public static String API_GET_ROOM_BY_ID = base_url+ "/admin/room/{id}";
    public static String API_AUTH_REFRESH_TOKEN = base_url+ "/auth/refresh-token" ;
    public static String API_GET_MOVIES_WILL_SHOWING = base_url+ "/movies/will/showing";
    public static  String API_GET_CITES = base_url +"/movies/cities";
    public static  String API_GET_SETTINGS = base_url +"/admin/setting";
    public static String API_GET_TICKETS_BY_USER_ID = base_url+  "/ticket/user/{id}";
    public static String API_CREATE_TICKET =  base_url + "/ticket/create" ;
    public static String API_CALLBACK_PAYMENT =  base_url + "/ticket/vn-pay" ;
    public static String API_AUTH_REGISTER = base_url +  "/auth/register";
    public static String API_AUTH_LOGIN = base_url+ "/auth/authenticate";
    public static String API_AUTH_PROFILE = base_url+ "/auth/profile";

    public static String API_AUTH_INFO_PROFILE = base_url+ "/auth/profile";


    public static String API_AUTH_LOGOUT = base_url+"/auth/logout";
    public static String API_GET_MOVIES = base_url + "/movies";
    public static String APT_GET_MOVIE_BY_ID =  base_url +  "/movies/{id}";
    public static String API_EVENT_BY_ID =  base_url +  "/movies/events/booking/{id}";
    public static String API_GET_ALL_COMBO = base_url+ "/movies/combos";
    public static String API_CREATE_BOOKING =  base_url+  "/create/booking";
}
