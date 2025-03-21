package com.movie.frontend.controller.client;

import com.movie.frontend.model.MovieDTO;
import com.movie.frontend.constants.Apis;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("/movies")
public class MovieController {

    @GetMapping("/isShowing")
    public String movieIsShowing(Model model) {
        RestTemplate restTemplate = new RestTemplate();
        // API : GET_MOVIES
        String getMoviesURL = Apis.API_GET_MOVIES_IS_SHOWING;
        ResponseEntity<MovieDTO[]> response = restTemplate.getForEntity(getMoviesURL,MovieDTO[].class);
        MovieDTO[] listMovie = response.getBody();
        model.addAttribute("movies" , listMovie) ;
        return "client/movie/movieIsShowing";
    }
    @GetMapping("/willShowing")
    public String movieWillShowing(Model model) {
        RestTemplate restTemplate = new RestTemplate();
        // API : GET_MOVIES
        String getMoviesURL = Apis.API_GET_MOVIES_WILL_SHOWING;
        ResponseEntity<MovieDTO[]> response = restTemplate.getForEntity(getMoviesURL,MovieDTO[].class);
        MovieDTO[] listMovie = response.getBody();
        model.addAttribute("movies" , listMovie) ;
        return "client/movie/movieWillShowing";
    }
}
