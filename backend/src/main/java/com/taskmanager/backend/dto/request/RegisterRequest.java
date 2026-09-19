package com.taskmanager.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "The fullName is required")
    @Size(min = 4, max = 20, message = "The fullName must be between 4 and 20 characters")
    String fullName,
    
    @NotBlank(message = "The email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "The password is required")
    @Size(min = 6, message = "The password must be at least 6 characters")
    String password
) {}
