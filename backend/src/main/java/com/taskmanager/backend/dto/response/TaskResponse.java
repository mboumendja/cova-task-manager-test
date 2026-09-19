package com.taskmanager.backend.dto.response;

import com.taskmanager.backend.entity.TaskStatus;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskStatus status
) {}
