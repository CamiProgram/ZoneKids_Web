package com.zonekids.springboot.api.zonekidsBackend.security;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Servicio personalizado para cargar detalles del usuario desde la BD
 * Implementa UserDetailsService de Spring Security
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Carga un usuario por su email (usado como username)
     * @param email Email del usuario a cargar
     * @return UserDetails del usuario encontrado
     * @throws UsernameNotFoundException si el usuario no existe
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscar el usuario por email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // Crear una lista de autoridades basada en el rol del usuario
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        
        // Agregar el rol con el prefijo "ROLE_" (requerido por Spring Security)
        if (user.getRol() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRol().getValor().toUpperCase()));
        }

        // Retornar un UserDetails con los datos del usuario
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getContrasena(),
                user.getEstado().equals("activo"), // enabled: solo usuarios activos pueden autenticarse
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities
        );
    }
}
