package com.zonekids.springboot.api.zonekidsBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

@SpringBootApplication
@ComponentScan(basePackages = "com.zonekids.springboot.api.zonekidsBackend") // Asegura que Spring escanee todos los paquetes
@EnableJdbcHttpSession // Habilitar sesiones persistentes con JDBC
public class FullrestApplication { 

    public static void main(String[] args) {
        SpringApplication.run(FullrestApplication.class, args); 
    }

    // ELIMINAMOS el @Bean CommandLineRunner init(...)
    // La inicialización del StorageService debe ocurrir dentro de su constructor
}