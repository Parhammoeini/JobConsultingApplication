# 🤖 AI-Powered Job Consulting Platform

> **Enterprise-Grade RAG Pipeline with Hybrid-Cloud LLM Orchestration**

---

## 🚀 Executive Summary

This platform is a high-performance **Retrieval-Augmented Generation (RAG)** application designed to provide context-aware career consulting. By leveraging a **Hybrid-Cloud AI architecture**, the system optimizes for both embedding precision and LLM inference speed.

The backend is built on **Spring Boot 3** and utilizes **Vector Search** to deliver grounded, hallucination-free AI responses based on uploaded PDF resumes.

---

## 🛠 Technical Stack & Architecture

### AI & Machine Learning — RAG Orchestration

| Component | Technology | Role |
|---|---|---|
| **LLM (The Brain)** | Llama 3.3-70b-versatile via Groq | High-speed, low-latency reasoning |
| **Embeddings (The Memory)** | OpenAI `text-embedding-3-small` | 1536-dimensional vector representations |
| **Vector Database** | PostgreSQL + PGVector extension | High-dimensional Cosine Similarity search |
| **AI Framework** | Spring AI | Abstraction layer across AI providers & vector store |

### Backend Infrastructure

| Component | Technology |
|---|---|
| **Language & Runtime** | Java 21 |
| **Framework** | Spring Boot 3.4.x |
| **Security** | Spring Security — JWT-based Stateless Auth |
| **Persistence** | Hibernate / JPA + PostgreSQL |
| **Cloud & DevOps** | Railway (Automated CI/CD), Docker containerization |

---

## 🧠 Design Patterns & Advanced Concepts

### 1. Retrieval-Augmented Generation (RAG)

Instead of relying on an LLM's static training data, the system implements a full RAG pipeline across three phases:

**Ingestion Phase**
PDF resumes are parsed, chunked, and vectorized into the PGVector store.

**Retrieval Phase**
User queries are embedded in real-time to retrieve the most semantically relevant resume segments via Cosine Similarity Search.

**Augmentation Phase**
Retrieved context is injected into a specialized System Prompt, ensuring the AI has full awareness of the candidate's specific history before responding.

---

### 2. Hybrid-Cloud AI Strategy

The architecture demonstrates a deliberate **"Best-of-Breed" provider selection**:

- **OpenAI** — Used exclusively for embeddings, providing industry-standard 1536-dimension vector stability.
- **Groq (LPUs)** — Used for inference, delivering lightning-fast chat responses and significantly reducing **Time to First Token (TTFT)** compared to standard GPU-based providers.

> 💡 **Interview Talking Point:** *"I chose a hybrid approach to optimize for cost and latency. OpenAI provides consistent 1536-dimension embeddings, while Groq's LPU architecture allows for near-instantaneous chat responses — a superior UX that standard GPU providers can't match."*

---

### 3. Stateless Security Pattern

A custom **JWT (JSON Web Token)** filter is integrated into the Spring Security chain, enabling secure, scalable, and stateless authentication across all API endpoints — making the service ready for horizontal scaling out of the box.

---

## 📈 Industrial & Academic Highlights

**Scalability**
Stateless microservice design enables horizontal scaling in containerized environments without session affinity concerns.

**Precision**
Cosine Distance algorithms power vector similarity search, mathematically optimizing retrieval for semantic relevance rather than keyword matching.

**Data Integrity**
Structured metadata management is applied to all stored documents, ensuring accurate filtering and retrieval precision during the RAG pipeline's retrieval phase.

---

## ⚙️ Local Development & Setup

### Prerequisites

- JDK 21
- Docker (for local PGVector instance)
- API Keys: OpenAI, Groq

### Environment Variables

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/job_db
SPRING_AI_OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
JWT_SECRET=your_32_byte_secret
```

### Run

```bash
./gradlew bootRun
```

---

## 🗺 Architecture Overview

```
User Query
    │
    ▼
[Spring Boot API]  ──JWT Auth──▶  Secured Endpoints
    │
    ▼
[OpenAI Embeddings]  ──1536-dim vector──▶  [PGVector Similarity Search]
                                                      │
                                               Top-K Resume Chunks
                                                      │
    ┌─────────────────────────────────────────────────┘
    │
    ▼
[System Prompt + Retrieved Context]
    │
    ▼
[Groq LPU Inference — Llama 3.3-70b]
    │
    ▼
Grounded, Hallucination-Free Response
```

---

## 📄 License

This project is proprietary. All rights reserved.
