package com.movie.frontend.controller.client;

import com.movie.frontend.model.CityDTO;
import com.movie.frontend.constants.Apis;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("/cinemas")
public class CinemaController {


    @GetMapping
    public String listAllCity(Model model) {
        RestTemplate restTemplate = new RestTemplate();
        // API : GET_CITES
        String getCitesURL = Apis.API_GET_CITIES;
        ResponseEntity<CityDTO[]> response = restTemplate.getForEntity(getCitesURL,CityDTO[].class);
        CityDTO[] cites = response.getBody();
        model.addAttribute("cites" , cites);
        return "client/cinema";
    }

}
