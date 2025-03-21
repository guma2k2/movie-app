package com.movie.frontend.service;

import com.movie.frontend.model.SeatDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {


    public int checkRemainSeats(List<SeatDTO> seats) {
        int lengthOfRoom = seats.size();
        int remainSeat = lengthOfRoom;

        // get remain seats

        for (SeatDTO seatDTO : seats) {
            if(seatDTO.isPaid() || seatDTO.isReserved()) {
                remainSeat-=1;
            }
        }
        return remainSeat ;
    }
    public List<String> getDifferentTypeOfListSeat(List<SeatDTO> seats) {
        return seats.stream()
                .map(seatDTO -> seatDTO.getType().name())
                .distinct()
                .collect(Collectors.toList());
    }

    public void setListSeat(List<SeatDTO> seats, int row_num, int col_num) {
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
    }
}
