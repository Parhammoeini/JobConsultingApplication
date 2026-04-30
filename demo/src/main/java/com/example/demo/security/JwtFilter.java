package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        System.out.println("DEBUG JwtFilter - Authorization header: " + header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("DEBUG JwtFilter - Token: " + token.substring(0, 20) + "...");
            boolean valid = jwtUtil.isValid(token);
            System.out.println("DEBUG JwtFilter - Token valid: " + valid);
            if (valid) {
                String email = jwtUtil.extractEmail(token);
                System.out.println("DEBUG JwtFilter - Email: " + email);
                var auth = new UsernamePasswordAuthenticationToken(email, null, List.of());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}
