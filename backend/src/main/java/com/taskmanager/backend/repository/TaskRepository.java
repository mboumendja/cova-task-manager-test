package com.taskmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanager.backend.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

}
