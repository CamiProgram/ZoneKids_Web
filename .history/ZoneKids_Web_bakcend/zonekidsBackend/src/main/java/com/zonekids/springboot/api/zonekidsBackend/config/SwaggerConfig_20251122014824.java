package com.zonekids.springboot.api.zonekidsBackend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de Swagger/OpenAPI para documentación automática de la API
 */
@Configuration
public class SwaggerConfig {

    /**
     * Define la configuración principal del OpenAPI
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ZoneKids API - Evaluación 3")
                        .version("1.0.0")
                        .description("API REST segura para ZoneKids con autenticación JWT, " +
                                "control de acceso basado en roles (RBAC) y gestión de productos y órdenes")
                        .contact(new Contact()
                                .name("Camilotapia")
                                .url("https://zonekids.example.com")
                                .email("camilotapia828@gmail.com")
                        )
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingresa el token JWT recibido en el login\n" +
                                                "Formato: Bearer <token>\n" +
                                                "Ejemplo: Bearer eyJhbGciOiJIUzI1NiJ9...")
                        )
                );
    }
}
