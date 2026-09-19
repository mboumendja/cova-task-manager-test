package com.taskmanager.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest( 
    @NotBlank(message = "The email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "The password is required")
    String password
) {}
