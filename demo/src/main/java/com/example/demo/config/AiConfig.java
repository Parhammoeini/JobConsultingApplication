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

@Configuration
public class AiConfig {

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${huggingface.api.key}")
    private String huggingfaceApiKey;

    @Bean
    @Primary
    public OpenAiChatModel chatModel() {
        OpenAiApi groqApi = OpenAiApi.builder()
            .baseUrl("https://api.groq.com/openai")
            .apiKey(groqApiKey)
            .build();
        return OpenAiChatModel.builder()
            .openAiApi(groqApi)
            .defaultOptions(OpenAiChatOptions.builder()
                .model("llama-3.3-70b-versatile")
                .build())
            .build();
    }

    @Bean
    @Primary
    public EmbeddingModel embeddingModel() {
        OpenAiApi hfApi = OpenAiApi.builder()
            .baseUrl("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2")
            .apiKey(huggingfaceApiKey)
            .build();
        return new OpenAiEmbeddingModel(hfApi,
            null,
            OpenAiEmbeddingOptions.builder()
                .model("sentence-transformers/all-MiniLM-L6-v2")
                .build(),
            null);
    }
}
