package com.movie.frontend.service;

import com.movie.frontend.model.ComboDTO;
import com.movie.frontend.constants.Apis;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ComboService {

    public ComboDTO[] getCombos() {
        RestTemplate restTemplate = new RestTemplate() ;
        String getCombosURL = Apis.API_GET_ALL_COMBO;
        ResponseEntity<ComboDTO[]> response = restTemplate.getForEntity(getCombosURL,ComboDTO[].class);
        ComboDTO[] combos = response.getBody();
        return combos ;
    }

    public List<ComboDTO> setListCombo(HttpServletRequest servletRequest) {
        ComboDTO[] combos = getCombos();

        // set List comboDTO to save booking
        List<ComboDTO> usedCombo = new ArrayList<>();
        for (ComboDTO combo : combos) {
            // In html. i was configured input with name(the title of combo) which had value is quantity
            // so i can get quantity from HttpServletRequest
            int quantity = Integer.parseInt(servletRequest.getParameter(combo.getTitle()));
            if ( quantity > 0) {
//                    log.info(combo.getTitle());
                ComboDTO comboDTO = new ComboDTO();
                comboDTO.setId(combo.getId());
                comboDTO.setQuantity(quantity);
                usedCombo.add(comboDTO);
            }
        }
        return usedCombo;
    }
}
