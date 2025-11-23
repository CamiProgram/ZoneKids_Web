package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequestDto {

    private String email;
    private String contrasena;
}


