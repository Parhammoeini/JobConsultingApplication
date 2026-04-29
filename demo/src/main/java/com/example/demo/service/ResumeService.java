package com.example.demo.service;

import com.example.demo.model.Resume;
import com.example.demo.repository.ResumeRepository;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Autowired private ResumeRepository resumeRepository;
    @Autowired private VectorStore vectorStore;

    @Transactional
    public Resume saveResume(String name, String content) {
        Resume resume = new Resume();
        resume.setCandidateName(name);
        resume.setContent(content);
        return resumeRepository.save(resume);
    }

    public List<String> getAllCandidateNames() {
        return resumeRepository.findAll()
            .stream()
            .map(Resume::getCandidateName)
            .distinct()
            .collect(Collectors.toList());
    }
}
