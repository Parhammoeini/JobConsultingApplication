package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.get("fullName");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        userRepository.save(user);

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token, "email", email, "fullName", fullName));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        return userRepository.findByEmail(email)
            .filter(u -> passwordEncoder.matches(password, u.getPassword()))
            .map(u -> {
                String token = jwtUtil.generateToken(email);
                return ResponseEntity.ok(Map.of("token", token, "email", email, "fullName", u.getFullName()));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
