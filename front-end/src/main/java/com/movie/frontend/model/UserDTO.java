package com.movie.frontend.model;

import lombok.Data;

import java.util.Set;
@Data
public class UserDTO {

    private Long id ;
    private String password ;
    private String firstName ;
    private String lastName;
    private String fullName ;
    private String email ;
    private boolean status ;
    private String photo;
    private String photosImagePath;
    private String verificationCode;
    private String forgotPassword ;
    private Set<RoleDTO> roles ;
    private String phone_number;
}
