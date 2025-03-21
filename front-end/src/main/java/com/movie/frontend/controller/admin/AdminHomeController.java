package com.movie.frontend.controller.admin;


import com.movie.frontend.model.CityDTO;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.model.JwtToken;
import com.movie.frontend.model.ProfileResponse;
import com.movie.frontend.model.ProfileUpdateRequest;
import com.movie.frontend.service.CityService;
import com.movie.frontend.service.UserService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/admin")
@Slf4j
public class AdminHomeController {

    @Autowired
    private CityService cityService ;

    @Autowired
    private UserService userService;
    @GetMapping
    public String adminHome(HttpSession session, Model model) {
        try {
            String token = Utility.getJwt(session) ;
//            log.info(token);
            List<CityDTO> cites = cityService.findAll(session) ;
            LocalDate endDate = LocalDate.now();
            LocalDate  startDate = endDate.minusDays(1);
            model.addAttribute("startDate" , startDate);
            model.addAttribute("endDate" , endDate);
            model.addAttribute("token" , token ) ;
            model.addAttribute("cites", cites) ;
            return "admin/home" ;
        } catch (HttpClientErrorException | JwtExpirationException e ) {
            return "redirect:/login";
        }

    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        return "redirect:/";
    }


    @GetMapping("/about")
    public String about() {
        return "admin/about";
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
            return "admin/profile";
        }catch (HttpClientErrorException  | JwtExpirationException e) {
            log.info(e.getMessage());
            redirectAttributes.addFlashAttribute("message" , "Mật khẩu hoặc tài khoản không hợp lệ") ;
            return "redirect:/login";
        }
    }


    @PostMapping("/profile")
    public String profile(HttpServletRequest request,
                          RedirectAttributes redirectAttributes ,
                          HttpSession session ,
                          Model model
    ) {

        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String phoneNumber = request.getParameter("phoneNumber");
        String password = request.getParameter("password");
        ProfileUpdateRequest profileUpdateRequest = new ProfileUpdateRequest(firstName, lastName, phoneNumber, password);
        try{
            JwtToken jwtToken = userService.updateProfile(profileUpdateRequest);
            session.setAttribute("jwtToken" , jwtToken);
            session.setAttribute("fullName" , jwtToken.getUser().getFullName());
            return "redirect:/admin/profile";
        }catch (HttpClientErrorException e) {
            log.info(e.getResponseBodyAsString());
            redirectAttributes.addFlashAttribute("message" , "Mật khẩu hoặc tài khoản không hợp lệ") ;
            return "redirect:/login";
        }
    }
}
