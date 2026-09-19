package com.taskmanager.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskmanager.backend.dto.request.LoginRequest;
import com.taskmanager.backend.dto.request.RegisterRequest;
import com.taskmanager.backend.dto.response.LoginResponse;
import com.taskmanager.backend.dto.response.RegisterResponse;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.exception.EmailAlreadyExistsException;
import com.taskmanager.backend.jwt.JwtUtil;
import com.taskmanager.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public RegisterResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Un utilisateur existe déjà avec cet email");
        }

        User user = User.builder()
            .fullName(request.fullName())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .build();

        userRepository.save(user);

        return new RegisterResponse("Compte crée avec succès");
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = (User) authentication.getPrincipal();

        String accessToken = jwtUtil.generateToken(request.email());

        return new LoginResponse(user.getFullName(), user.getEmail(), accessToken, 3600L);
    }
}
