package com.zonekids.springboot.api.zonekidsBackend.config;

import com.zonekids.springboot.api.zonekidsBackend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de seguridad con Spring Security y JWT
 * Implementa control de acceso basado en roles (RBAC)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Habilita @PreAuthorize y @PostAuthorize
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Bean para codificar contraseñas con BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean para el AuthenticationManager (necesario para validar credenciales en el login)
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configuración de seguridad HTTP
     * Define rutas públicas, protegidas y validaciones por rol
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ===== CSRF DESHABILITADO =====
                // JWT no usa sesiones estándar, por lo que CSRF no es necesario
                .csrf(csrf -> csrf.disable())

                // ===== CONFIGURACIÓN DE RUTAS =====
                .authorizeHttpRequests(authz -> authz
                        // ===== RUTAS PÚBLICAS (Sin autenticación) =====
                        .requestMatchers("/api/v1/auth/**").permitAll()           // Login y Registro
                        .requestMatchers("/swagger-ui.html").permitAll()          // Swagger UI
                        .requestMatchers("/swagger-ui/**").permitAll()            // Swagger Resources
                        .requestMatchers("/v3/api-docs/**").permitAll()           // OpenAPI JSON
                        .requestMatchers("/doc/**").permitAll()                   // Documentación custom

                        // ===== RUTAS PROTEGIDAS =====
                        // Todas las demás rutas requieren autenticación
                        .anyRequest().authenticated()
                )

                // ===== CONFIGURACIÓN DE SESIONES =====
                // Stateless: cada petición debe tener su propio token JWT
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ===== AGREGAR FILTRO JWT =====
                // El filtro JWT se ejecuta antes del filtro de autenticación por defecto
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
