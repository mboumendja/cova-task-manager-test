package com.taskmanager.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.taskmanager.backend.dto.request.LoginRequest;
import com.taskmanager.backend.dto.request.RegisterRequest;
import com.taskmanager.backend.dto.response.LoginResponse;
import com.taskmanager.backend.dto.response.RegisterResponse;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.exception.EmailAlreadyExistsException;
import com.taskmanager.backend.jwt.JwtUtil;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.service.AuthService;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "Password123!"
        );

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded-password");

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password("encoded-password")
                .build();

        when(userRepository.save(any(User.class))).thenReturn(user);

        RegisterResponse response = authService.register(request);

        assertThat(response.message()).isEqualTo("Compte crée avec succès");
        verify(userRepository).existsByEmail(request.email());
        verify(passwordEncoder).encode(request.password());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldLoginUserSuccessfully() {
        LoginRequest request = new LoginRequest("john@example.com", "Password123!");

        User user = User.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .password("encoded-password")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(jwtUtil.generateToken(user.getEmail())).thenReturn("fake-jwt-token");

        LoginResponse response = authService.login(request);

        assertThat(response.fullName()).isEqualTo("John Doe");
        assertThat(response.email()).isEqualTo("john@example.com");
        assertThat(response.accessToken()).isEqualTo("fake-jwt-token");
        assertThat(response.expiresIn()).isEqualTo(3600L);

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil).generateToken(user.getEmail());
    }

    @Test
    void shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Password123!");

        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessage("Un utilisateur existe déjà avec cet email");

        verify(userRepository, never()).save(any(User.class));
    }
}