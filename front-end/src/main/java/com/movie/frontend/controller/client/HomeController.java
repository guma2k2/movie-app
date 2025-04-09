package com.movie.frontend.controller.client;


import com.movie.frontend.model.MovieDTO;
import com.movie.frontend.model.ProfileResponse;
import com.movie.frontend.constants.Apis;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;

@Controller
@RequestMapping("/")
@Slf4j
public class HomeController {

    @Value("${application.slider.image1}")
    private String urlSlider1 ;
    @Value("${application.slider.image2}")
    private String urlSlider2 ;
    @Value("${application.slider.image3}")
    private String urlSlider3 ;
    @Value("${application.slider.image4}")
    private String urlSlider4 ;

    @Autowired
    private UserService userService;


    @GetMapping
    public String homePage(Model model) {
        RestTemplate restTemplate = new RestTemplate();
        // API : GET_MOVIES
        String getMoviesURL = Apis.API_GET_MOVIES;
        ResponseEntity<MovieDTO[]> response = restTemplate.getForEntity(getMoviesURL,MovieDTO[].class);
        MovieDTO[] listMovie = response.getBody();
//        log.info(listMovie.toString());
        String[] sliders = new String[]{urlSlider1, urlSlider2 , urlSlider3 , urlSlider4};
        model.addAttribute("sliders" , sliders);
        model.addAttribute("movies" ,listMovie);
        return "client/home" ;
    }

    @GetMapping("/movie/{id}")
    public String movieDetail(Model model , @PathVariable("id") Long id ) {
        RestTemplate restTemplate = new RestTemplate();
        // API : GET_MOVIE_BY_ID
        String getMovieByIdURL = Apis.API_GET_MOVIE_BY_ID;
        UriComponentsBuilder builder = UriComponentsBuilder
				.fromUriString(getMovieByIdURL)
				.uriVariables(Collections
						.singletonMap("id", id));
        ResponseEntity<MovieDTO> response = restTemplate.getForEntity(builder.toUriString(),MovieDTO.class);
        MovieDTO movieDTO = response.getBody();
        model.addAttribute("movie" ,movieDTO );
        return "client/movie/movieDetail";
    }

    @GetMapping("/login")
    public String login() {
        return "client/login" ;
    }

    @GetMapping("/register")
    public String register() {
        return "client/register" ;
    }

    @GetMapping("/profile")
    public String profile (Model model, RedirectAttributes redirectAttributes, HttpSession session) {
        try{
            ProfileResponse profile = userService.getProfile(session);
            if (profile != null) {
                model.addAttribute("firstName", profile.firstName());
                model.addAttribute("lastName", profile.lastName());
                model.addAttribute("email", profile.email());
                model.addAttribute("phoneNumber", profile.phoneNumber());
            }
            return "client/profile";
        }catch (HttpClientErrorException  | JwtExpirationException e) {
            log.info(e.getMessage());
            redirectAttributes.addFlashAttribute("message" , "Mật khẩu hoặc tài khoản không hợp lệ") ;
            return "redirect:/login";
        }
    }

}
