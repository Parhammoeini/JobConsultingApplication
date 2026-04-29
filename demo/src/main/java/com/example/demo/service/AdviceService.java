package com.example.demo.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdviceService {

    private final ChatClient chatClient;

    @Autowired private VectorStore vectorStore;

    public AdviceService(@Qualifier("openAiChatModel") ChatModel chatModel) {
        this.chatClient = ChatClient.builder(chatModel).build();
    }

    public String getAdvice(String query, String candidate) {
        SearchRequest.Builder requestBuilder = SearchRequest.builder()
            .query(query)
            .topK(5);

        if (candidate != null && !candidate.isBlank()) {
            FilterExpressionBuilder b = new FilterExpressionBuilder();
            requestBuilder.filterExpression(b.eq("candidateName", candidate).build());
        }

        List<Document> docs = vectorStore.similaritySearch(requestBuilder.build());

        String context = docs.stream()
            .map(Document::getText)
            .collect(Collectors.joining("\n---\n"));

        String prompt = """
            You are a Senior Career Consultant.
            Candidate: %s
            Context from their resume:
            %s
            
            Answer this question specifically about this candidate: %s
            """.formatted(candidate != null ? candidate : "Unknown", context, query);

        return chatClient.prompt()
            .user(prompt)
            .call()
            .content();
    }
}
