package com.example.demo.service;

import com.example.demo.model.Resume;
import com.example.demo.repository.ResumeRepository;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private VectorStore vectorStore;

    @Transactional
    public Resume saveResume(String name, String content) {
        // 1. Save standard record
        Resume resume = new Resume();
        resume.setCandidateName(name);
        resume.setContent(content);
        Resume saved = resumeRepository.save(resume);

        // 2. Create a "Document" for the AI
        // This automatically calls Ollama behind the scenes!
        Document doc = new Document(content, Map.of(
            "candidate", name,
            "id", saved.getId()
        ));
        
        vectorStore.add(List.of(doc));
        return saved;
    }
}