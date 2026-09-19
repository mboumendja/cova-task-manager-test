package com.taskmanager.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.taskmanager.backend.dto.request.TaskRequest;
import com.taskmanager.backend.dto.response.TaskResponse;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.exception.TaskNotFoundException;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.service.TaskService;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private User buildUser() {
        return User.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("encoded-password")
                .build();
    }

    // ---------- getAllTasks ----------

    @Test
    void shouldReturnAllTasksForUser() {
        User user = buildUser();

        Task task1 = Task.builder()
                .title("Task 1")
                .description("Desc 1")
                .status(TaskStatus.PENDING)
                .user(user)
                .build();

        Task task2 = Task.builder()
                .title("Task 2")
                .description("Desc 2")
                .status(TaskStatus.PENDING)
                .user(user)
                .build();

        when(taskRepository.findByUser(user)).thenReturn(List.of(task1, task2));

        List<TaskResponse> responses = taskService.getAllTasks(user);

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).title()).isEqualTo("Task 1");
        assertThat(responses.get(1).title()).isEqualTo("Task 2");

        verify(taskRepository).findByUser(user);
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoTasks() {
        User user = buildUser();

        when(taskRepository.findByUser(user)).thenReturn(List.of());

        List<TaskResponse> responses = taskService.getAllTasks(user);

        assertThat(responses).isEmpty();
        verify(taskRepository).findByUser(user);
    }

    // ---------- store ----------

    @Test
    void shouldCreateTaskSuccessfully() {
        User user = buildUser();
        TaskRequest request = new TaskRequest("New Task", "New Description", "PENDING");

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskResponse response = taskService.store(request, user);

        assertThat(response.title()).isEqualTo("New Task");
        assertThat(response.description()).isEqualTo("New Description");
        assertThat(response.status()).isEqualTo(TaskStatus.PENDING);

        verify(taskRepository).save(any(Task.class));
    }

    // ---------- update ----------

    @Test
    void shouldUpdateTaskSuccessfully() {
        User user = buildUser();
        Task existingTask = Task.builder()
                .title("Old Title")
                .description("Old Description")
                .status(TaskStatus.PENDING)
                .user(user)
                .build();

        TaskRequest request = new TaskRequest("Updated Title", "Updated Description", "IN_PROGRESS");

        when(taskRepository.findByIdAndUser(eq(1L), eq(user))).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(existingTask);

        TaskResponse response = taskService.update(1L, request, user);

        assertThat(response.title()).isEqualTo("Updated Title");
        assertThat(response.description()).isEqualTo("Updated Description");
        assertThat(response.status()).isEqualTo(TaskStatus.IN_PROGRESS);

        verify(taskRepository).findByIdAndUser(1L, user);
        verify(taskRepository).save(existingTask);
    }

    @Test
    void shouldThrowWhenUpdatingNonExistentTask() {
        User user = buildUser();
        TaskRequest request = new TaskRequest("Title", "Description", "PENDING");

        when(taskRepository.findByIdAndUser(eq(99L), eq(user))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.update(99L, request, user))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task not found");

        verify(taskRepository, never()).save(any(Task.class));
    }

    // ---------- delete ----------

    @Test
    void shouldDeleteTaskSuccessfully() {
        User user = buildUser();
        Task task = Task.builder()
                .title("To Delete")
                .description("Description")
                .status(TaskStatus.PENDING)
                .user(user)
                .build();

        when(taskRepository.findByIdAndUser(eq(1L), eq(user))).thenReturn(Optional.of(task));

        taskService.delete(1L, user);

        verify(taskRepository).findByIdAndUser(1L, user);
        verify(taskRepository).delete(task);
    }

    @Test
    void shouldThrowWhenDeletingNonExistentTask() {
        User user = buildUser();

        when(taskRepository.findByIdAndUser(eq(99L), eq(user))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.delete(99L, user))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task not found");

        verify(taskRepository, never()).delete(any(Task.class));
    }
}