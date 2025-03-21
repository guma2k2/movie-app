package com.movie.frontend.controller.admin;


import com.movie.frontend.model.CinemaDTO;
import com.movie.frontend.model.CityDTO;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.CinemaService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/admin/cinema")
@Controller
public class CinemaAdminController {

    @Autowired
    private CinemaService cinemaService ;

    private String rootUrl = "admin/cinema" ;

    @GetMapping
    public String findAll(HttpSession session,
                          Model model) {
        try {
            String token = Utility.getJwt(session) ;
            List<CinemaDTO> cinemas = cinemaService.findAll(session);
            List<CityDTO> cites = cinemaService.listCity(session) ;
            model.addAttribute("cites", cites) ;
            model.addAttribute("token", token) ;
            model.addAttribute("cinemas", cinemas) ;
            return  rootUrl +  "/cinema" ;
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }
    }

}
