package com.taskmanager.backend.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.backend.dto.request.TaskRequest;
import com.taskmanager.backend.dto.response.TaskResponse;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getUserTasks(@AuthenticationPrincipal User user) {
        List<TaskResponse> tasks = taskService.getAllTasks(user);
        return ResponseEntity.ok().body(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request, @AuthenticationPrincipal User user) {
        
        TaskResponse task = taskService.store(request, user);

        return ResponseEntity.ok().body(task);
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long taskId, 
        @RequestBody TaskRequest request, @AuthenticationPrincipal User user
    ) {
        TaskResponse task = taskService.update(taskId, request, user);
        
        return ResponseEntity.ok().body(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId, @AuthenticationPrincipal User user) {
        taskService.delete(taskId, user);

        return ResponseEntity.ok().body("Task deleted");
    }
    
}
