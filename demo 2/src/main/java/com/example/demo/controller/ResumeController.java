package com.example.demo.controller;

import com.example.demo.model.Resume;
import com.example.demo.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public Resume uploadResume(@RequestParam String name, @RequestBody String content) {
        // This takes the name and the raw text of the resume
        return resumeService.saveResume(name, content);
    }
}