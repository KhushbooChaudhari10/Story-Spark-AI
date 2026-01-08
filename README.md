🌟 StorySpark AI

From a Child’s Drawing to a Magical Storybook — Powered by AI

StorySpark AI is a full-stack, multimodal AI application that transforms a child’s drawing and voice idea into a fully illustrated, narrated storybook.

This project demonstrates real-world AI system design, combining:

Vision AI

Large Language Models

Text-to-Speech & Speech-to-Text

Async task processing

Workflow orchestration (n8n)

Scalable backend architecture

Child-friendly frontend UX


🚀 What StorySpark AI Does

🧒 Child draws a picture or records a voice idea

🤖 AI understands the drawing / speech

✍️ AI generates a scene-based story

🎨 AI creates illustrations for each page

🎙️ AI narrates the story

📖 A flip-book style storybook is generated

💾 Story is stored for reuse & recommendations

🧠 System Architecture (High Level)
Frontend (Next.js)
        ↓
Main Backend (Node.js + Express)
        ↓
AI Orchestration (n8n)
        ↓
AI Backend (FastAPI)
        ↓
Celery Workers (Async)
        ↓
Vision | LLM | TTS | STT
        ↓
Cloudinary | Supabase | MongoDB

⚙️ Core Technologies Used
Frontend

Next.js (App Router)

React + TypeScript

Tailwind CSS

HTML Canvas (Drawing)

react-pageflip (storybook UI)

Backend

Node.js + Express

MongoDB + Mongoose

Firebase Authentication

Cloudinary (images & audio)

PDF generation (storybook export)

AI & ML

LLaMA 3.3 70B (Groq) – story generation

Gemini Vision – drawing understanding

Whisper – speech-to-text

Gemini TTS / pyttsx3 – narration

Sentence Transformers (MiniLM) – embeddings

AI Backend & Orchestration

FastAPI – AI gateway

Celery – async AI execution

Redis – broker & result backend

n8n – workflow orchestration

Storage

MongoDB – users, children, drawings, storybooks

Cloudinary – images & audio

Supabase (pgvector) – embeddings & AI memory

🔁 n8n Workflow (AI Orchestration)

StorySpark AI uses n8n as the brain of the AI pipeline.

What the Workflow Handles

Triggering AI tasks after uploads

Managing task IDs & polling

Sequencing:

Drawing detection

Story generation

Image generation

Audio narration

Storybook creation

Error handling & retries

Keeping backend APIs lightweight

Why n8n?

Visual, debuggable AI pipelines

Easy to extend & modify

Production-friendly orchestration

Decouples logic from code

This allows StorySpark AI to scale without rewriting backend logic.

🔄 AI Processing Flow (Detailed)
Child Input
  ├─ Drawing Upload → Vision AI → Object Extraction
  ├─ Voice Upload   → Whisper → Structured Prompt
        ↓
Prompt Engineering
        ↓
LLM Story Generation (Scene-based JSON)
        ↓
Background Image Generation (per page)
        ↓
Audio Narration (per page)
        ↓
Storybook Assembly
        ↓
Vector Storage (Supabase)

⚡ Why Celery Is Used

AI tasks are slow and expensive.
Celery ensures:

Non-blocking APIs

Parallel execution

Worker-based scaling

Safe retries

Fault isolation

Each AI step runs as an independent background task.

👨‍👩‍👧 User Roles
Parent

Firebase-authenticated login

Create & manage children

View children’s stories

Download storybooks (PDF)

Child

Name-only login (no passwords)

Draw or upload images

Record voice ideas

View narrated storybooks

📂 Project Structure (Simplified)
StorySpark-AI/
│
├── frontend/           # Next.js app
├── backend/            # Node.js + Express API
├── ai-backend/
│   ├── main.py         # FastAPI AI gateway
│   ├── celery_app.py   # Celery configuration
│   ├── tasks/          # AI background tasks
│
├── AI_CORE/
│   ├── vision/
│   ├── story/
│   ├── tts/
│   ├── tools/
│
├── workflows/          # n8n workflows
└── README.md

🧪 Key Engineering Highlights

✅ Multimodal AI (vision + speech + Text)
✅ Async AI pipelines with Celery
✅ Workflow orchestration using n8n
✅ Production-style backend separation
✅ Vector DB for future RAG & recommendations
✅ Child-safe UX decisions
✅ Fault-tolerant AI execution

🎯 Real-World Use Cases

Children’s storytelling platforms

EdTech creativity tools

AI-assisted learning apps

Storybook publishing automation

Voice-driven creative AI systems

🔮 Future Improvements

Multi-language stories

Personalized story recommendations

User story history & profiles

Streaming story generation

Mobile app version

Advanced parental controls

👨‍💻 Author

Khush Chaudhari
AI Engineer | Data Analyst | Full-Stack AI Developer

GitHub: Add link

LinkedIn: Add link