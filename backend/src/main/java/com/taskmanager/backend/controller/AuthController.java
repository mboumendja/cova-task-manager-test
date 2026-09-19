package com.taskmanager.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.backend.dto.request.LoginRequest;
import com.taskmanager.backend.dto.request.RegisterRequest;
import com.taskmanager.backend.dto.response.RegisterResponse;
import com.taskmanager.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.taskmanager.backend.dto.response.LoginResponse;


@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = authService.register(request);
        
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok().body(response);
    }
    
    
}
