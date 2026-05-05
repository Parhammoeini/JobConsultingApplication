package com.example.demo.controller;

import com.example.demo.model.Resume;
import com.example.demo.service.AdviceService;
import com.example.demo.service.ResumeService;
import com.example.demo.service.SearchService;
import org.apache.tika.Tika;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired private ResumeService resumeService;
    @Autowired private SearchService searchService;
    @Autowired private AdviceService adviceService;
    @Autowired private VectorStore vectorStore;

    private final Tika tika = new Tika();

    @PostMapping("/upload")
    public Resume uploadResume(@RequestParam String name, @RequestBody String content, Authentication auth) {
        String userEmail = auth.getName();
        Document doc = new Document(content, Map.of("candidateName", name, "userEmail", userEmail));
        TokenTextSplitter splitter = new TokenTextSplitter(256, 50, 5, 10000, true);
        List<Document> chunks = splitter.apply(List.of(doc));
        chunks.forEach(chunk -> chunk.getMetadata().put("userEmail", userEmail));
        vectorStore.add(chunks);
        return resumeService.saveResume(name, content, userEmail);
    }

    @GetMapping("/me")
    public Optional<Resume> getMyResume(Authentication auth) {
        return resumeService.getResume(auth.getName());
    }

    @GetMapping("/search")
    public List<Document> search(@RequestParam String query, @RequestParam(defaultValue = "3") int topK, Authentication auth) {
        return searchService.search(query, topK, auth.getName());
    }

    @GetMapping("/advice")
    public String advice(@RequestParam String query, Authentication auth) {
        return adviceService.getAdvice(query, auth.getName());
    }

    @PostMapping("/upload-pdf")
    public String uploadPdf(@RequestParam("name") String name, @RequestParam("file") MultipartFile file, Authentication auth) {
        try {
            String userEmail = auth.getName();
            String content = tika.parseToString(file.getInputStream());
            Document fullDoc = new Document(content, Map.of("candidateName", name, "userEmail", userEmail));
            TokenTextSplitter splitter = new TokenTextSplitter(256, 50, 5, 10000, true);
            List<Document> chunks = splitter.apply(List.of(fullDoc));
            chunks.forEach(chunk -> chunk.getMetadata().put("userEmail", userEmail));
            vectorStore.add(chunks);
            resumeService.saveResume(name, content, userEmail);
            return "PDF processed! Split into " + chunks.size() + " chunks.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
