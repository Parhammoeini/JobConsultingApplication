package com.example.demo.repository;

import com.example.demo.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Optional<Resume> findByUserEmail(String userEmail);

    @Modifying
    @Query("DELETE FROM Resume r WHERE r.userEmail = :userEmail")
    void deleteByUserEmail(String userEmail);
}
