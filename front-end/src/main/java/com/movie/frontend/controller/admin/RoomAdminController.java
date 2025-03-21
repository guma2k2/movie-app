package com.movie.frontend.controller.admin;


import com.movie.frontend.model.*;
import com.movie.frontend.exception.JwtExpirationException;
import com.movie.frontend.service.CinemaService;
import com.movie.frontend.service.RoomService;
import com.movie.frontend.utility.Utility;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/admin/room")
@Controller
@Slf4j
public class RoomAdminController {

    @Autowired
    private RoomService roomService;

    private String rootUrl = "admin/room" ;
    @Autowired
    private CinemaService cinemaService ;
    @GetMapping
    public String findAll(HttpSession session,
                          Model model) {
        try {

            DataContent data = roomService.findAllPaginate(session);
            List<RoomDTO> rooms = data.getResults();
            Paginate paginate = data.getPaginate();
            String sortDir = paginate.getSortDir();
            String sortField = paginate.getSortField();
            int sizePage = paginate.getSizePage() ; // 5 element per page
            int currentPage =  paginate.getCurrentPage() ; // 1 - totalPage
            int totalPage  = paginate.getTotalPage() ; // totalPage
            int totalElements = paginate.getTotalElements() ;
            int start = (currentPage - 1) * sizePage + 1;
            int end = start +sizePage - 1;
            if(end > totalElements) {
                end = (int) totalElements ;
            }
            String token = Utility.getJwt(session) ;
            List<CityDTO> cites = cinemaService.listCity(session) ;
            model.addAttribute("cites", cites) ;
            model.addAttribute("sortDir" , sortDir);
            model.addAttribute("sortField" , sortField );
            model.addAttribute("sizePage" ,sizePage );
            model.addAttribute("currentPage" ,currentPage );
            model.addAttribute("totalPage" , totalPage);
            model.addAttribute("totalElements" , totalElements);
            model.addAttribute("start" , start);
            model.addAttribute("end" , end);
            model.addAttribute("rooms" , rooms) ;
            model.addAttribute("token" , token );
            return rootUrl + "/room" ;
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }
    }

    @GetMapping("/{roomId}")
    public String returnCityByRoom(@PathVariable("roomId") Long roomId,
                                   HttpSession session,
                                   RedirectAttributes redirectAttributes) {
        try {
            RoomDTO room = roomService.get(roomId , session) ;
            String cinemaName = room.getCinemaName() ;
            log.info(cinemaName);
            Integer cityId = room.getCinema().getCity().getId();
            log.info(String.valueOf(cityId));
            redirectAttributes.addFlashAttribute("cinemaName" , cinemaName);
            redirectAttributes.addFlashAttribute("cityId" , cityId);
            return "redirect:/admin/room";
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }
    }

    @GetMapping("/{roomId}/seats")
    public String get(HttpSession session,
                      @PathVariable("roomId") Long roomId ,
                      Model model) {
        try {
            String jwt = Utility.getJwt(session) ;
            RoomDTO room = roomService.get(roomId , session) ;
            int row_num = Integer.parseInt(room.getCapacity().split("x")[0]) ;
            int col_num = Integer.parseInt(room.getCapacity().split("x")[1]) ;
            List<SeatDTO> seats = room.getSeats();
            List<String> types = Arrays.stream(SeatTypeDTO.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
//            for(String type : types) {
//                log.info(type);
//            }

            for (int i = 1 ; i <= row_num ;i++) {
                for (int j = 1 ; j <= col_num ;j++) {
                    boolean ok = true ;
                    for (SeatDTO seatDTO : seats) {
                        if(seatDTO.getColumn_num() == j && seatDTO.getRow_num() == i) {
                            ok = false;
                        }
                    }
                    if(ok) {
                        SeatDTO seatDTO = new SeatDTO();
                        seatDTO.setRow_num(i);
                        seatDTO.setColumn_num(j);
                        seatDTO.setEmpty(true);
                        seats.add(seatDTO) ;
                    }
                }
            }
            model.addAttribute("row_num" , row_num);
            model.addAttribute("col_num" , col_num);
            model.addAttribute("types" , types);
            model.addAttribute("seats" , seats) ;
            model.addAttribute("room" , room) ;
            model.addAttribute("token" , jwt) ;
            return rootUrl +  "/roomId" ;
        } catch (JwtExpirationException e) {
            return "redirect:/" ;
        }

    }
}
