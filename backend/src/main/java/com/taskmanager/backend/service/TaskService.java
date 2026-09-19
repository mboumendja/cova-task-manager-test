package com.taskmanager.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskmanager.backend.dto.request.TaskRequest;
import com.taskmanager.backend.dto.response.TaskResponse;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.exception.TaskNotFoundException;
import com.taskmanager.backend.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskResponse> getAllTasks(User user){

        List<Task> tasks = taskRepository.findByUser(user);

        return tasks.stream()
            .map(task -> new TaskResponse(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getStatus()
            ))
            .toList();
    }

    public TaskResponse store(TaskRequest request, User user) {

        TaskStatus statusEnum = TaskStatus.parseStatus(request.status());

        Task task = Task.builder()
            .title(request.title())
            .description(request.description())
            .status(statusEnum)
            .user(user)
            .build();
        
        taskRepository.save(task);

        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus()
        );
    }

    public TaskResponse update(Long taskId, TaskRequest request, User user) {

        Task task = taskRepository.findByIdAndUser(taskId, user)
            .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        TaskStatus statusEnum = TaskStatus.parseStatus(request.status());

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(statusEnum);

        taskRepository.save(task);

        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus()
        );
    }

    public void delete(Long taskId, User user) {

        Task task = taskRepository.findByIdAndUser(taskId, user)
            .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        taskRepository.delete(task);
    }
}
