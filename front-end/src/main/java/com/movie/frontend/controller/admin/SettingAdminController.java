package com.movie.frontend.controller.admin;

import com.movie.frontend.model.Setting;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.SettingService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin/settings")
public class SettingAdminController {

    @Autowired
    private SettingService settingService;

    @GetMapping
    public String findAll(HttpSession session,
                          Model model) {
        try {
            String token = Utility.getJwt(session) ;
            List<Setting> settings = settingService.findAll(session);
            for(Setting setting : settings) {
                model.addAttribute(setting.getKey(), setting.getValue());
            }
            model.addAttribute("token", token) ;
            return  "admin/setting";
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }
    }
    @PostMapping("/save")
    public String saveSetting(HttpServletRequest request,
                              HttpSession session,
                              Model model,
                              RedirectAttributes redirectAttributes) {
        try {
            String token = request.getParameter("token") ;
            List<Setting> settings = settingService.findAll(session);
            settings.forEach(setting -> {
                if(setting.getValue() != request.getParameter(setting.getKey())){
                    setting.setValue((String) request.getParameter(setting.getKey()));
                }
            });
            String res = settingService.saveSetting(settings, token, session);
            model.addAttribute("token", token) ;
            redirectAttributes.addFlashAttribute("message" , res);
            return  "redirect:/admin/settings";
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }
    }
}
