package com.movie.frontend.controller.admin;

import com.movie.frontend.model.*;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.MovieService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/movie")
public class MovieAdminController {

    @Autowired
    private MovieService movieService ;
    private String rootUrl = "admin/movie" ;

    @GetMapping
    public String findAll(HttpSession session , Model model) {
        try {
            DataContent data = movieService.findAll(session);
            List<MovieDTO> movies = data.getResults();
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
            List<String> languages = Arrays.stream(LanguageDTO.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
            List<String> ratings = Arrays.stream(RatingDTO.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
            List<GenreDTO> genres = movieService.findAllGenre(session) ;

            String token = Utility.getJwt(session) ;
            model.addAttribute("languages" , languages);
            model.addAttribute("genres" , genres);
            model.addAttribute("ratings" , ratings);
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
            model.addAttribute("movies" , movies) ;
            return rootUrl + "/movie";
        }catch (HttpClientErrorException | JwtExpirationException e) {
            return "redirect:/" ;
        }
    }
}
