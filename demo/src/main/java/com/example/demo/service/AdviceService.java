package com.example.demo.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdviceService {

    private final ChatClient chatClient;
    @Autowired private VectorStore vectorStore;

    public AdviceService(ChatModel chatModel) {
        this.chatClient = ChatClient.builder(chatModel).build();
    }

    public String getAdvice(String query, String userEmail) {
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(5)
                .filterExpression(b.eq("userEmail", userEmail).build())
                .build()
        );

        String context = docs.stream()
            .map(Document::getText)
            .collect(Collectors.joining("\n---\n"));

        String prompt = """
            You are a Senior Career Consultant.
            Context from the user's resume:
            %s
            Answer this question: %s
            """.formatted(context, query);

        return chatClient.prompt()
            .user(prompt)
            .call()
            .content();
    }
}
