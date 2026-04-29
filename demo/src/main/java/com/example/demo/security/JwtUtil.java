package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key = Keys.hmacShaKeyFor(
        "careerflow-super-secret-key-2024-must-be-32-bytes!!".getBytes()
    );

    private final long EXPIRATION = 1000 * 60 * 60 * 24;

    public String generateToken(String email) {
        return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(key)
            .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    public boolean isValid(String token) {
        try {
            extractEmail(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
