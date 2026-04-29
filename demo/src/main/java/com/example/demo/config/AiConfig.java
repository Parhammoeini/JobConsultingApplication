package com.example.demo.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class AiConfig {

    // This pulls the dimension size from your properties file (1024 for Ollama, 1536 for OpenAI)
    @Value("${spring.ai.vectorstore.pgvector.dimensions:1024}")
    private int dimensions;

    @Bean
    @Primary
    public VectorStore vectorStore(
        JdbcTemplate jdbcTemplate, 
        @Qualifier("openAiEmbeddingModel") EmbeddingModel embeddingModel) { // Force OpenAI here
    
    return PgVectorStore.builder(jdbcTemplate, embeddingModel)
            .dimensions(dimensions)
            .initializeSchema(true)
            .build();
}

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173") // Matches Vite's default port
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}