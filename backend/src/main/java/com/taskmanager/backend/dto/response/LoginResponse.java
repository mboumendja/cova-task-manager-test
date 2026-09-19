package com.taskmanager.backend.dto.response;

public record LoginResponse(
    String fullName,
    String email,
    String accessToken,
    Long expiresIn
) {}
