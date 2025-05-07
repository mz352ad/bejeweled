package com.game.bejeweled.server.controller;

import com.game.bejeweled.entity.User;
import com.game.bejeweled.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user, HttpSession session) {
        // Validate input
        if (user.getEmail() == null || user.getEmail().trim().isEmpty() ||
                user.getPassword() == null || user.getPassword().trim().isEmpty() ||
                user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("All fields are required"));
        }

        // Check if email already exists
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(createErrorResponse("Email already in use"));
        }

        // Check if username already exists
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(createErrorResponse("Username already in use"));
        }

        // Save user
        User savedUser = userService.save(user);

        // Set user in session
        session.setAttribute("user", savedUser.getUsername());
        session.setAttribute("userEmail", savedUser.getEmail());
        session.setAttribute("authenticated", true);

        // Create response with user info but without password
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("username", savedUser.getUsername());
        response.put("email", savedUser.getEmail());
        response.put("authenticated", true);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData, HttpSession session) {
        // Validate input
        if (loginData.getUsername() == null || loginData.getUsername().trim().isEmpty() ||
                loginData.getPassword() == null || loginData.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("Username and password are required"));
        }

        // Find user by username instead of email
        User user = userService.findByUsername(loginData.getUsername());

        // Check if user exists and password matches
        if (user == null || !user.getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.status(401).body(createErrorResponse("Invalid credentials"));
        }

        // Set user in session
        session.setAttribute("user", user.getUsername());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("authenticated", true);

        // Create response with user info but without password
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("authenticated", true);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String username, HttpSession session) {
        // Check if session is valid
        String sessionUsername = (String) session.getAttribute("user");
        if (sessionUsername != null && sessionUsername.equals(username)) {
            // Session is already valid for this user
            Map<String, Object> response = new HashMap<>();
            response.put("username", sessionUsername);
            response.put("email", session.getAttribute("userEmail"));
            return ResponseEntity.ok(response);
        }

        // Otherwise, check database
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Create response with user info but without password
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        // Clear session attributes
        session.removeAttribute("user");
        session.removeAttribute("userEmail");
        session.removeAttribute("authenticated");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logout successful");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        String username = (String) session.getAttribute("user");
        Boolean authenticated = (Boolean) session.getAttribute("authenticated");

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", authenticated != null && authenticated);
        response.put("username", username);

        return ResponseEntity.ok(response);
    }

    // Helper method to create error responses
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("success", false);
        return response;
    }
}