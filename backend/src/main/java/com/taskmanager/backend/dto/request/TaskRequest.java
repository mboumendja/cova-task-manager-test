package com.taskmanager.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TaskRequest(
    @NotBlank(message="The title is required")
    String title,
    @NotBlank(message="The description is required")
    String description,
    @NotBlank (message="The status is required")
    String status
) {}
