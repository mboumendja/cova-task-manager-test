package com.taskmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanager.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
