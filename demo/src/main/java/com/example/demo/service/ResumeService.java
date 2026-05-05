package com.example.demo.service;

import com.example.demo.model.Resume;
import com.example.demo.repository.ResumeRepository;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {

    @Autowired private ResumeRepository resumeRepository;
    @Autowired private VectorStore vectorStore;

    @Transactional
    public Resume saveResume(String name, String content, String userEmail) {
        // Delete old resume record
        resumeRepository.deleteByUserEmail(userEmail);

        // Delete old vectors
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        List<org.springframework.ai.document.Document> old = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(content)
                .topK(100)
                .filterExpression(b.eq("userEmail", userEmail).build())
                .build()
        );
        if (!old.isEmpty()) {
            vectorStore.delete(old.stream().map(org.springframework.ai.document.Document::getId).toList());
        }

        Resume resume = new Resume();
        resume.setCandidateName(name);
        resume.setContent(content);
        resume.setUserEmail(userEmail);
        return resumeRepository.save(resume);
    }

    public Optional<Resume> getResume(String userEmail) {
        return resumeRepository.findByUserEmail(userEmail);
    }

    public String getCandidateName(String userEmail) {
        return resumeRepository.findByUserEmail(userEmail)
            .map(Resume::getCandidateName)
            .orElse(null);
    }
}
