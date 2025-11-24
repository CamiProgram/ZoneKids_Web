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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ===== CSRF DESHABILITADO =====
                .csrf(csrf -> csrf.disable())

                // ===== CORS HABILITADO =====
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ===== CONFIGURACIÓN DE RUTAS =====
                .authorizeHttpRequests(authz -> authz
                        // ===== RUTAS PÚBLICAS (Sin autenticación) =====
                        .requestMatchers("/api/v1/auth/**").permitAll()           // Login y Registro
                        .requestMatchers("/api/v1/productos").permitAll()         // GET productos (lectura pública)
                        .requestMatchers("GET", "/api/v1/productos/**").permitAll() // GET producto por ID (lectura pública)
                        .requestMatchers("/swagger-ui.html").permitAll()          // Swagger UI
                        .requestMatchers("/swagger-ui/**").permitAll()            // Swagger Resources
                        .requestMatchers("/v3/api-docs/**").permitAll()           // OpenAPI JSON
                        .requestMatchers("/doc/**").permitAll()                   // Documentación custom
                        .requestMatchers("OPTIONS", "/**").permitAll()            // Preflight CORS

                        // ===== RUTAS PROTEGIDAS SOLO ADMIN =====
                        .requestMatchers("/api/v1/upload/**").hasRole("ADMIN")    // Upload de imágenes (solo ADMIN)
                        .requestMatchers("POST", "/api/v1/productos").hasRole("ADMIN")      // Crear producto (solo ADMIN)
                        .requestMatchers("PUT", "/api/v1/productos/**").hasRole("ADMIN")    // Editar producto (solo ADMIN)
                        .requestMatchers("DELETE", "/api/v1/productos/**").hasRole("ADMIN") // Eliminar producto (solo ADMIN)
                        .requestMatchers("PATCH", "/api/v1/productos/**").hasRole("ADMIN")  // Cambiar estado/imágenes (solo ADMIN)
                        .requestMatchers("GET", "/api/v1/usuarios/**").hasRole("ADMIN")     // Ver detalles usuarios (solo ADMIN)
                        .requestMatchers("DELETE", "/api/v1/usuarios/**").hasRole("ADMIN")  // Eliminar usuarios (solo ADMIN)
                        .requestMatchers("PATCH", "/api/v1/usuarios/**").hasRole("ADMIN")   // Cambiar estado usuarios (solo ADMIN)

                        // ===== RUTAS PROTEGIDAS (Cualquier usuario autenticado) =====
                        .requestMatchers("/api/v1/usuarios").authenticated()       // Listar usuarios (autenticado)
                        .requestMatchers("PUT", "/api/v1/usuarios/perfil").authenticated() // Actualizar perfil propio (autenticado)
                        .requestMatchers("/api/v1/ordenes/**").authenticated()     // Órdenes - acceso con autenticación
                        .requestMatchers("/api/v1/boletas/**").authenticated()     // Boletas - acceso con autenticación
                        .requestMatchers("/api/v1/datos-personales/**").authenticated() // Datos personales - acceso con autenticación

                        // ===== RUTAS PROTEGIDAS POR DEFECTO =====
                        .anyRequest().authenticated()
                )

                // ===== CONFIGURACIÓN DE SESIONES =====
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ===== AGREGAR FILTRO JWT =====
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configuración de CORS a nivel de Spring Security
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:8080",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
