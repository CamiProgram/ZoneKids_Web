# 🔍 EJEMPLOS DE CÓDIGO - Backend 403 Debug

## 📌 Resumen del Problema

Frontend está enviando requests correctamente a:
- `GET /api/v1/ordenes` - Retorna 403 
- `GET /api/v1/usuarios` - Retorna 403

Ambos con token JWT válido y rol ADMIN.

---

## 🔧 Código Que Debería Estar en Backend

### 1. Generación del JWT en Login

**Archivo esperado**: `AuthController.java` o `LoginController.java`

```java
@PostMapping("/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        // Validar credenciales
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail());
        
        if (usuario == null || !verificarContrasena(request.getContrasena(), usuario.getContrasena())) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Credenciales inválidas"));
        }
        
        // ⭐ CRÍTICO: Verificar que el rol está siendo incluido
        System.out.println("✅ Usuario autenticado: " + usuario.getEmail());
        System.out.println("👤 Rol del usuario: " + usuario.getRol());  // ← LOG IMPORTANTE
        
        // Generar JWT con rol
        String token = generarJWT(usuario);
        System.out.println("🔐 JWT generado exitosamente");
        
        // Retornar respuesta
        LoginResponse response = new LoginResponse(
            token,
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNombre(),
            usuario.getRol()  // ← EL ROL SE RETORNA
        );
        
        return ResponseEntity.ok(new ApiResponse(true, "Login exitoso", response));
        
    } catch (Exception e) {
        System.err.println("❌ Error en login: " + e.getMessage());
        return ResponseEntity.status(500).body(new ApiResponse(false, "Error en login"));
    }
}
```

### 2. Método para Generar JWT

**Archivo esperado**: `JwtTokenProvider.java` o similar

```java
public String generarJWT(Usuario usuario) {
    try {
        System.out.println("🔄 Generando JWT para: " + usuario.getEmail());
        System.out.println("   Rol: " + usuario.getRol());
        
        // ⭐ CRÍTICO: El rol DEBE incluirse en los claims
        Claims claims = Jwts.claims().setSubject(usuario.getId().toString());
        claims.put("email", usuario.getEmail());
        claims.put("rol", usuario.getRol());  // ← ROL DEBE ESTAR AQUÍ
        claims.put("nombre", usuario.getNombre());
        
        System.out.println("✅ Claims creados con rol: " + usuario.getRol());
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 86400000); // 24 horas
        
        String token = Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
        
        System.out.println("🔐 JWT generado. Length: " + token.length());
        return token;
        
    } catch (Exception e) {
        System.err.println("❌ Error generando JWT: " + e.getMessage());
        throw new RuntimeException("Error generando JWT", e);
    }
}
```

### 3. Filter de Autorización para Admin

**Archivo esperado**: `AdminAuthorizationFilter.java` o en `SecurityConfig.java`

```java
public class AdminAuthorizationFilter extends OncePerRequestFilter {
    
    private static final String SECRET = "tu-secret-key-aqui";
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {
        
        String url = request.getRequestURI();
        
        // ⭐ CRÍTICO: Verificar si es endpoint admin
        if (url.contains("/api/v1/usuarios") || url.contains("/api/v1/ordenes")) {
            
            System.out.println("\n🔍 ════════════════════════════════════════");
            System.out.println("🔍 ENDPOINT ADMIN DETECTADO");
            System.out.println("🔍 URL: " + url);
            System.out.println("🔍 Método: " + request.getMethod());
            
            // Obtener header
            String authHeader = request.getHeader("Authorization");
            System.out.println("🔍 Auth Header presente: " + (authHeader != null));
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ FALLO: No hay token en header");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"No autorizado\"}");
                return;
            }
            
            // Extraer token
            String token = authHeader.substring(7); // Remover "Bearer "
            System.out.println("✅ Token extraído. Length: " + token.length());
            
            try {
                // ⭐ CRÍTICO: Parsear token y verificar rol
                Claims claims = Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token)
                    .getBody();
                
                System.out.println("✅ Token válido");
                System.out.println("🔍 Subject: " + claims.getSubject());
                System.out.println("🔍 Email: " + claims.get("email"));
                
                // ⭐ CRÍTICO: Obtener rol del JWT
                Object rolObj = claims.get("rol");
                String rol = rolObj != null ? rolObj.toString() : null;
                
                System.out.println("🔍 Rol extraído: " + rol);
                System.out.println("🔍 Rol es null: " + (rol == null));
                System.out.println("🔍 Rol tipo: " + (rol != null ? rol.getClass().getName() : "N/A"));
                System.out.println("🔍 Rol valor exact: '" + rol + "'");
                
                // ⭐ CRÍTICO: Validar que sea ADMIN
                if (rol == null) {
                    System.out.println("❌ FALLO: Rol es NULL en el JWT");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("{\"error\":\"Rol no encontrado en token\"}");
                    return;
                }
                
                // Comparación case-insensitive para ser seguro
                if (!rol.equalsIgnoreCase("ADMIN")) {
                    System.out.println("❌ FALLO: Rol '" + rol + "' no es ADMIN");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("{\"error\":\"Solo ADMIN puede acceder\"}");
                    return;
                }
                
                System.out.println("✅ AUTORIZACIÓN EXITOSA - Rol es ADMIN");
                System.out.println("🔍 ════════════════════════════════════════\n");
                
            } catch (SignatureException e) {
                System.out.println("❌ FALLO: Firma del token inválida: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("{\"error\":\"Token inválido\"}");
                return;
            } catch (MalformedJwtException e) {
                System.out.println("❌ FALLO: Token malformado: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("{\"error\":\"Token malformado\"}");
                return;
            } catch (ExpiredJwtException e) {
                System.out.println("❌ FALLO: Token expirado: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Token expirado\"}");
                return;
            } catch (Exception e) {
                System.out.println("❌ FALLO: Error procesando token: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("{\"error\":\"Error procesando token\"}");
                return;
            }
        }
        
        // Continuar con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}
```

### 4. Controller de Órdenes

**Archivo esperado**: `OrdenenController.java` (nota el typo que podría haber)

```java
@RestController
@RequestMapping("/api/v1/ordenes")
public class OrdenenController {
    
    private final OrdenRepository ordenRepository;
    
    public OrdenenController(OrdenRepository ordenRepository) {
        this.ordenRepository = ordenRepository;
    }
    
    /**
     * Obtener todas las órdenes (Solo ADMIN)
     */
    @GetMapping
    public ResponseEntity<?> getAllOrdenes() {
        try {
            System.out.println("📊 GET /api/v1/ordenes - Obteniendo todas las órdenes");
            
            List<Orden> ordenes = ordenRepository.findAll();
            System.out.println("✅ Se encontraron " + ordenes.size() + " órdenes");
            
            return ResponseEntity.ok(new ApiResponse(
                true,
                "Órdenes obtenidas exitosamente",
                ordenes
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo órdenes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(
                false,
                "Error obteniendo órdenes"
            ));
        }
    }
    
    /**
     * Obtener orden por ID (Solo ADMIN)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrdenenById(@PathVariable Long id) {
        try {
            System.out.println("📊 GET /api/v1/ordenes/" + id);
            
            Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
            
            return ResponseEntity.ok(new ApiResponse(
                true,
                "Orden obtenida",
                orden
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo orden: " + e.getMessage());
            return ResponseEntity.status(404).body(new ApiResponse(
                false,
                "Orden no encontrada"
            ));
        }
    }
}
```

### 5. Controller de Usuarios

**Archivo esperado**: `UsuarioController.java`

```java
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {
    
    private final UsuarioRepository usuarioRepository;
    
    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    /**
     * Obtener todos los usuarios (Solo ADMIN)
     */
    @GetMapping
    public ResponseEntity<?> getAllUsuarios() {
        try {
            System.out.println("👥 GET /api/v1/usuarios - Obteniendo todos los usuarios");
            
            List<Usuario> usuarios = usuarioRepository.findAll();
            System.out.println("✅ Se encontraron " + usuarios.size() + " usuarios");
            
            return ResponseEntity.ok(new ApiResponse(
                true,
                "Usuarios obtenidos exitosamente",
                usuarios
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo usuarios: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(
                false,
                "Error obteniendo usuarios"
            ));
        }
    }
}
```

### 6. Configuración de Security (Spring Security)

**Archivo esperado**: `SecurityConfig.java` o `WebSecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeRequests()
                // ⭐ Endpoints públicos
                .antMatchers("/api/v1/auth/**").permitAll()
                .antMatchers("/api/v1/productos").permitAll()
                .antMatchers("/api/v1/productos/**").permitAll()
                // ⭐ Endpoints admin (protegidos)
                .antMatchers("/api/v1/ordenes/**").hasRole("ADMIN")
                .antMatchers("/api/v1/usuarios/**").hasRole("ADMIN")
                // ⭐ El resto requiere autenticación
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(new AdminAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
}
```

---

## 🚨 CHECKLIST DE COSAS CRÍTICAS

Antes de reportar que "no funciona", verificar:

- [ ] ¿El rol se incluye en el JWT al generar el token? (en `generarJWT()`)
- [ ] ¿El rol se extrae correctamente del JWT? (en el filter)
- [ ] ¿La comparación de rol es case-insensitive o exacta? (en el filter)
- [ ] ¿El endpoint `/api/v1/ordenes` existe? 
- [ ] ¿El endpoint `/api/v1/usuarios` existe?
- [ ] ¿Ambos endpoints retornan ApiResponse con estructura correcta?
- [ ] ¿El filter de admin se ejecuta antes que el controller?
- [ ] ¿El header Authorization se recibe en el backend?

---

## 📊 QUÉ DEBERÍA VER EN LOGS CUANDO TODO FUNCIONA

```
🔍 ════════════════════════════════════════
🔍 ENDPOINT ADMIN DETECTADO
🔍 URL: /api/v1/ordenes
🔍 Método: GET
🔍 Auth Header presente: true
✅ Token extraído. Length: 287
✅ Token válido
🔍 Subject: 1
🔍 Email: admin@example.com
🔍 Rol extraído: ADMIN
🔍 Rol es null: false
🔍 Rol tipo: java.lang.String
🔍 Rol valor exact: 'ADMIN'
✅ AUTORIZACIÓN EXITOSA - Rol es ADMIN
🔍 ════════════════════════════════════════

📊 GET /api/v1/ordenes - Obteniendo todas las órdenes
✅ Se encontraron 5 órdenes
```

---

## ❌ QUÉ DEBERÍA VER SI HAY ERROR

### Caso 1: Rol es null
```
🔍 Rol extraído: null
🔍 Rol es null: true
❌ FALLO: Rol es NULL en el JWT
```
**Solución**: Agregar `claims.put("rol", usuario.getRol());` en `generarJWT()`

### Caso 2: Rol es incorrecto
```
🔍 Rol extraído: CLIENTE
❌ FALLO: Rol 'CLIENTE' no es ADMIN
```
**Solución**: Verificar que el usuario en BD tiene rol "ADMIN"

### Caso 3: No hay auth header
```
🔍 Auth Header presente: false
❌ FALLO: No hay token en header
```
**Solución**: Verificar que frontend está enviando el header correctamente

---

## 🎯 PRÓXIMOS PASOS

1. Agregar los logs mostrados arriba al backend
2. Reiniciar el backend
3. Intentar acceder a `/admin/dashboard` desde frontend
4. Copiar los logs que aparecen
5. Identificar dónde falla según los logs
6. Hacer el fix correspondiente
7. Reiniciar backend
8. Probar nuevamente

Con los logs será obvio qué está fallando.
