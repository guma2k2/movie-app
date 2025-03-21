package com.movie.frontend.controller.admin;

import com.movie.frontend.model.CityDTO;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.CityService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/admin/schedule")
public class ScheduleAdminController {

    private String rootUrl = "admin/schedule" ;

    @Autowired
    private CityService cityService ;

    @GetMapping
    public String handleSchedule(HttpSession session,
                                 Model model) {
        try {
            String jwt = Utility.getJwt(session) ;
            List<CityDTO> cites = cityService.findAll(session) ;
            model.addAttribute("cites" , cites);
            model.addAttribute("token" , jwt );
            return  rootUrl+ "/scheduleCRUD" ;
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }


    }

    @GetMapping("/view")
    public String viewAll() {
        return  "" ;
    }
}
