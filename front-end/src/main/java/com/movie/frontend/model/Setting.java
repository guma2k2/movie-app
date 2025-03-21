package com.movie.frontend.model;

import lombok.Data;

@Data
public class Setting {
    private String key ;
    private String value ;
    private TypeSetting type;
}
