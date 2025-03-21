package com.movie.backend.security.auth;

import com.movie.backend.dto.ProfileResponse;
import com.movie.backend.dto.ProfileUpdateRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {
        try {
            return ResponseEntity.ok(service.register(request));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestBody String code ) {
        try {
            return ResponseEntity.ok(service.verify(code));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/outbound/authentication")
    ResponseEntity<AuthenticationResponse> outboundAuthenticate(
            @RequestParam String code
    ){
        AuthenticationResponse result = service.outboundAuthenticate(code);
        return ResponseEntity.ok().body(result);
    }


    @PutMapping("/profile")
    ResponseEntity<AuthenticationResponse> updateProfile(
            @RequestBody ProfileUpdateRequest request
    ){
        AuthenticationResponse result = service.updateProfile(request);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/profile")
    ResponseEntity<ProfileResponse> getProfile(
    ){
        return ResponseEntity.ok().body(service.getProfile());
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody String email ) {
        try {
            return ResponseEntity.ok(service.resetPassword(email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verifyPassword")
    public ResponseEntity<?> verifyPassword(@RequestBody String code ) {
        try {
            return ResponseEntity.ok(service.verifyPassword(code));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/confirmPassword/{token}")
    public ResponseEntity<?> confirmPassword(@RequestBody String password , @PathVariable("token")String token) {
        try {
            return ResponseEntity.ok(service.confirmPassword(password , token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        try {
            return ResponseEntity.ok().body(service.authenticate(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request
    )  {
            return ResponseEntity.ok().body(service.refreshToken(request));
    }


}
