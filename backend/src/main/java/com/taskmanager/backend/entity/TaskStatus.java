package com.taskmanager.backend.entity;

public enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED;

    public static TaskStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return PENDING;
        }

        try {
            return valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return PENDING;
        }
    }
}
