package com.movie.frontend.controller.admin;

import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.model.*;
import com.movie.frontend.service.BookingService;
import com.movie.frontend.service.MovieService;
import com.movie.frontend.utility.DateUtil;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/booking")
public class BookingAdminController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public String findAll(HttpSession session , Model model) {
        try {
            DataContent data = bookingService.findAll(session);
            List<BookingDTO> bookings = data.getResults();
            Paginate paginate = data.getPaginate();
            int sizePage = paginate.getSizePage() ; // 5 element per page
            int currentPage =  paginate.getCurrentPage() ; // 1 - totalPage
            int totalPage  = paginate.getTotalPage() ; // totalPage
            int totalElements = paginate.getTotalElements() ;
            int start = (currentPage - 1) * sizePage + 1;
            int end = start +sizePage - 1;
            if(end > totalElements) {
                end = totalElements ;
            }

            String token = Utility.getJwt(session) ;
            model.addAttribute("sizePage" ,sizePage );
            model.addAttribute("currentPage" ,currentPage );
            model.addAttribute("totalPage" , totalPage);
            model.addAttribute("totalElements" , totalElements);
            model.addAttribute("start" , start);
            model.addAttribute("end" , end);
            model.addAttribute("token" , token );
            model.addAttribute("bookings" , bookings) ;
            return "admin/booking/booking";
        }catch (HttpClientErrorException | JwtExpirationException e) {
            return "redirect:/" ;
        }
    }

    @GetMapping("/{bookingId}")
    public String findById(HttpSession session , Model model, @PathVariable("bookingId") Long bookingId) {
        try {
            BookingDTO booking = bookingService.findById(session, bookingId);
            String token = Utility.getJwt(session) ;
            model.addAttribute("token" , token );
            model.addAttribute("booking" , booking );
            return "admin/booking/bookingDetail";
        }catch (HttpClientErrorException | JwtExpirationException e) {
            return "redirect:/" ;
        }
    }
}
