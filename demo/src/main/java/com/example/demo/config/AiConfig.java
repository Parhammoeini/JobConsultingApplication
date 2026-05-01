package com.example.demo.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.retry.support.RetryTemplate;

@Configuration
public class AiConfig {

    @Value("${spring.ai.openai.api-key}")
    private String openaiApiKey;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Bean
    @Primary
    public OpenAiChatModel chatModel() {
        // Points to Groq
        OpenAiApi groqApi = OpenAiApi.builder()
            .baseUrl("https://api.groq.com/openai")
            .apiKey(groqApiKey)
            .build();
            
        return new OpenAiChatModel(groqApi, OpenAiChatOptions.builder()
                .model("llama-3.3-70b-versatile")
                .build());
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        // Points to OpenAI (Standard)
        OpenAiApi openAiApi = OpenAiApi.builder()
            .apiKey(openaiApiKey)
            .build();

        return new OpenAiEmbeddingModel(openAiApi,
            org.springframework.ai.document.MetadataMode.EMBED,
            OpenAiEmbeddingOptions.builder()
                .model("text-embedding-3-small")
                .build(),
            RetryTemplate.defaultInstance());
    }
}