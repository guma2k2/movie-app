package com.movie.frontend.controller.admin;

import com.movie.frontend.model.*;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.UserService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/admin/user")
@Controller

public class UserController {

    @Autowired
    private UserService userService ;
    public String rootUrl = "admin/user" ;
    @GetMapping
    public String listAll(HttpSession session , Model model) {
        try {
            DataContent data = userService.findAll(session);
            List<UserDTO> users = data.getResults();
            Paginate paginate = data.getPaginate();
            String sortDir = paginate.getSortDir();
            String sortField = paginate.getSortField();
            String keyword = paginate.getKeyword() ;
            int sizePage = paginate.getSizePage() ; // 5 element per page
            int currentPage =  paginate.getCurrentPage() ; // 1 - totalPage
            int totalPage  = paginate.getTotalPage() ; // totalPage
            int totalElements = paginate.getTotalElements() ;
            int start = (currentPage - 1) * sizePage + 1;
            int end = start +sizePage - 1;
            if(end > totalElements) {
                end = totalElements ;
            }
            List<RoleDTO> roles = userService.findAllRole(session) ;
            String token = Utility.getJwt(session) ;
            model.addAttribute("roles" , roles);
            model.addAttribute("sortDir" , sortDir);
            model.addAttribute("sortField" , sortField );
            model.addAttribute("sizePage" ,sizePage );
            model.addAttribute("keyword" ,keyword );
            model.addAttribute("currentPage" ,currentPage );
            model.addAttribute("totalPage" , totalPage);
            model.addAttribute("totalElements" , totalElements);
            model.addAttribute("start" , start);
            model.addAttribute("end" , end);
            model.addAttribute("token" , token );
            model.addAttribute("users" , users) ;
            return rootUrl + "/user" ;
        } catch (JwtExpirationException e) {
            return "redirect:/login" ;
        }

    }
}
