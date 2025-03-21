package com.movie.frontend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class RoleDTO {
    private Integer id ;
    private String name ;

    @Override
    public String toString() {
        return this.name;
    }
}
