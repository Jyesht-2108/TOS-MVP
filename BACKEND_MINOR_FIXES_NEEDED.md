# Backend Minor Fixes Needed

**Date:** March 10, 2026  
**Priority:** Low (Non-blocking for mobile team)  
**Time Required:** 30-45 minutes total

---

## ⚠️ ISSUES IDENTIFIED

### 1. CORS Configuration Missing (15 minutes) - MEDIUM PRIORITY

**Issue:**
- CORS settings exist in `application.yml` but not applied in code
- Mobile app will get CORS errors when connecting

**Current State:**
```yaml
# application.yml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
```

**Fix Required:**
Create `CorsConfig.java`:

```java
package com.school.transport.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:5173}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**File Location:** `backend/src/main/java/com/school/transport/config/CorsConfig.java`

---

### 2. WebSocket Dependency Cleanup - ✅ COMPLETE

**Status:** ✅ Removed

The `spring-boot-starter-websocket` dependency has been removed from `pom.xml`.

---

### 3. Security Configuration (Future - Not Urgent)

**Issue:**
- Security currently disabled (`permitAll()`)
- No JWT authentication
- GPS and SSE endpoints are unprotected

**Current State:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // ⚠️ Everything is public
            );
        return http.build();
    }
}
```

**Recommended Fix (Future):**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/health/ready").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/gps/**").hasRole("DRIVER")
                .requestMatchers("/api/driver/**").hasRole("DRIVER")
                .requestMatchers("/api/v1/routes/**").hasAnyRole("ADMIN", "DRIVER")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

**Note:** This requires implementing JWT authentication first. Not blocking for mobile team testing.

---

### 4. Rate Limiting for GPS Endpoint (Future - Production)

**Issue:**
- No rate limiting on GPS endpoint
- Driver could spam GPS updates
- Could cause database overload

**Recommended Fix (Future):**
Add rate limiting using Bucket4j or Spring Cloud Gateway:

```java
@RestController
@RequestMapping("/api/gps")
@RequiredArgsConstructor
@Slf4j
public class GpsTrackingController {
    
    private final GpsTrackingService gpsTrackingService;
    private final Map<UUID, Bucket> driverBuckets = new ConcurrentHashMap<>();
    
    @PostMapping("/update")
    public ResponseEntity<?> updateGpsLocation(
            @RequestBody GpsUpdateMessage message,
            @RequestHeader("X-Driver-Id") UUID driverId) {
        
        // Rate limit: 2 requests per minute per driver
        Bucket bucket = driverBuckets.computeIfAbsent(driverId, k -> 
            Bucket.builder()
                .addLimit(Limit.of(2, Duration.ofMinutes(1)))
                .build()
        );
        
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429)
                .body("Rate limit exceeded. Max 2 GPS updates per minute.");
        }
        
        // ... rest of the code
    }
}
```

**Note:** Not needed for MVP/testing phase.

---

## 🔧 IMMEDIATE ACTION ITEMS

### Must Do Before Mobile Team Testing:
1. ✅ **Add CORS Configuration** (15 minutes)
   - Create `CorsConfig.java`
   - Test with mobile app

### Should Do (Nice to Have):
2. ✅ **Remove WebSocket Dependency** - COMPLETE
   - Cleaned up `pom.xml`
   - No WebSocket code in project

### Can Wait (Future):
3. ⏳ **Implement JWT Authentication**
4. ⏳ **Add Rate Limiting**
5. ⏳ **Add Monitoring/Metrics**

---

## 📝 IMPLEMENTATION GUIDE

### Fix 1: Add CORS Configuration

**Step 1:** Create the file
```bash
touch backend/src/main/java/com/school/transport/config/CorsConfig.java
```

**Step 2:** Add the code (see above)

**Step 3:** Update `application-dev.yml`
```yaml
cors:
  allowed-origins: http://localhost:3000,http://localhost:5173,http://10.0.2.2:8080
```

**Step 4:** Restart backend
```bash
mvn spring-boot:run
```

**Step 5:** Test with curl
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/gps/update -v
```

Expected response should include:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

### Fix 2: Remove WebSocket Dependency

**Step 1:** Edit `pom.xml`
Remove the WebSocket dependency block

**Step 2:** Clean and rebuild
```bash
mvn clean install
```

**Step 3:** Verify no errors
```bash
mvn spring-boot:run
```

---

## ✅ VERIFICATION CHECKLIST

After applying fixes:

- [ ] Backend starts without errors
- [ ] CORS headers present in response
- [ ] Mobile app can connect to SSE endpoint
- [ ] Mobile app can send GPS updates
- [ ] No WebSocket-related dependencies in classpath
- [ ] All existing functionality still works

---

## 🎯 PRIORITY SUMMARY

**Critical (Do Now):**
- ✅ Add CORS configuration

**Important (Do Soon):**
- ⏳ Remove WebSocket dependency

**Nice to Have (Future):**
- ⏳ JWT authentication
- ⏳ Rate limiting
- ⏳ Monitoring

---

## 📊 CURRENT STATUS

### What's Working ✅
- SSE endpoint functional
- GPS endpoint functional
- Route notifications working
- Database operations working
- Error handling working

### What Needs Fixing ⚠️
- CORS configuration (15 min fix)

### What Can Wait ⏳
- Authentication (future)
- Rate limiting (future)
- Monitoring (future)

---

## 🚀 CONCLUSION

The backend is **functionally complete** and ready for mobile team integration. The CORS fix is the only blocking issue for mobile app testing. Everything else can be addressed later without impacting the mobile team's work.

**Total Time to Fix Blocking Issues:** 15 minutes

