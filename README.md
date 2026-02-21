# 🌟 StorySpark AI

From a Child's Drawing to a Magical Storybook — Powered by AI

StorySpark AI is a full-stack, multimodal AI application that transforms a child's drawing and voice idea into a fully illustrated, narrated storybook.

## 🚀 What StorySpark AI Does

🧒 **Child draws a picture or records a voice idea**  
🤖 **AI understands the drawing / speech**  
✍️ **AI generates a scene-based story**  
🎨 **AI creates illustrations for each page**  
🎙️ **AI narrates the story**  
📖 **A flip-book style storybook is generated**  
💾 **Story is stored for reuse & recommendations**

## 🧠 System Architecture

```
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
```

## 📁 Project Structure

```
StorySpark-AI/
│
├── Frontend/storypage/     # Next.js frontend app
├── Backend/                # Node.js + Express API
├── AI-Backend/             # FastAPI AI gateway
├── AI_CORE/               # Core AI processing modules
├── N8n-data/              # Workflow configurations
├── workflow/              # Additional workflow files
├── venv/                  # Python virtual environment
└── README.md
```

## ⚙️ Core Technologies

### Frontend
- **Next.js 15.5.6** (App Router with Turbopack)
- **React 19.1.0** + TypeScript
- **Tailwind CSS 4.1.17**
- **Firebase Authentication**
- **HTML Canvas** (Drawing)
- **react-pageflip** (storybook UI)

### Backend
- **Node.js + Express 5.1.0**
- **MongoDB + Mongoose 8.19.2**
- **Firebase Admin SDK 13.5.0**
- **Cloudinary** (images & audio)
- **PDF-lib** (storybook export)

### AI & ML
- **LLaMA 3.3 70B** (Groq) – story generation
- **Gemini Vision** – drawing understanding
- **Whisper** – speech-to-text
- **Gemini TTS / pyttsx3** – narration
- **Sentence Transformers (MiniLM)** – embeddings

### AI Backend & Orchestration
- **FastAPI 0.121.0** – AI gateway
- **Celery 5.5.3** – async AI execution
- **Redis** – broker & result backend
- **n8n** – workflow orchestration

### Storage
- **MongoDB** – users, children, drawings, storybooks
- **Cloudinary** – images & audio
- **Supabase (pgvector)** – embeddings & AI memory

## � Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- MongoDB
- Redis
- Firebase project
- Cloudinary account
- Groq API key
- Google AI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Story-Spark-AI
```

### 2. Frontend Setup
```bash
cd Frontend/storypage
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Backend Setup
```bash
cd Backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/storyspark
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./config/firebase.js
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key
GOOGLE_AI_API_KEY=your_google_ai_key
```

### 4. AI Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 5. Database Setup
- Start MongoDB service
- Start Redis service
- Configure Firebase Authentication
- Set up Cloudinary account

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd Backend
npm run dev
```

2. **Start AI Backend** (Terminal 2):
```bash
cd AI-Backend
uvicorn main:app --reload
```

3. **Start Celery Worker** (Terminal 3):
```bash
cd AI-Backend
celery -A celery_app.celery worker --loglevel=info
```

4. **Start Frontend** (Terminal 4):
```bash
cd Frontend/storypage
npm run dev
```

### Production Mode

1. **Build Frontend**:
```bash
cd Frontend/storypage
npm run build
npm start
```

2. **Start Backend**:
```bash
cd Backend
npm start
```

3. **Start AI Backend**:
```bash
cd AI-Backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `FIREBASE_SERVICE_ACCOUNT_KEY_PATH`: Path to Firebase service account
- `CLOUDINARY_*`: Cloudinary configuration
- `GROQ_API_KEY`: Groq API key for LLM
- `GOOGLE_AI_API_KEY`: Google AI API key for Vision/TTS

#### Frontend (.env.local)
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🔄 AI Processing Flow

```
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
```

## 👨‍👩‍👧 User Roles

### Parent
- Firebase-authenticated login
- Create & manage children
- View children's stories
- Download storybooks (PDF)

### Child
- Name-only login (no passwords)
- Draw or upload images
- Record voice ideas
- View narrated storybooks

## 🧪 Key Engineering Highlights

✅ **Multimodal AI** (vision + speech + text)  
✅ **Async AI pipelines** with Celery  
✅ **Workflow orchestration** using n8n  
✅ **Production-style backend separation**  
✅ **Vector DB** for future RAG & recommendations  
✅ **Child-safe UX decisions**  
✅ **Fault-tolerant AI execution**

## 🎯 Real-World Use Cases

- Children's storytelling platforms
- EdTech creativity tools
- AI-assisted learning apps
- Storybook publishing automation
- Voice-driven creative AI systems

## 🔮 Future Improvements

- Multi-language stories
- Personalized story recommendations
- User story history & profiles
- Streaming story generation
- Mobile app version
- Advanced parental controls

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Redis Connection Error**
   - Start Redis service
   - Verify Redis configuration

3. **Firebase Authentication Issues**
   - Check Firebase configuration
   - Verify API keys

4. **AI API Errors**
   - Validate API keys
   - Check rate limits
   - Review API quotas

## 📚 API Documentation

### Backend Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/children` - Create child profile
- `POST /api/drawings` - Upload drawing
- `POST /api/stories` - Generate story
- `GET /api/stories/:id` - Get story details

### AI Backend Endpoints

- `POST /process-drawing` - Process drawing with Vision AI
- `POST /generate-story` - Generate story with LLM
- `POST /generate-audio` - Generate narration
- `GET /task-status/:taskId` - Check task status

## Demo Videos
1. Phase 0 - https://youtu.be/37lPulTVnZw
2. Phase 1 - https://youtu.be/bo4dVHldECc
3. Phase 2 - https://youtu.be/xbD6GuovYqU
4. Phase 3 - https://youtu.be/f8Wa09TqjPk
5. Phase 4 - https://youtu.be/MbUDZIsf6Ks
6. Phase 5 - https://youtu.be/CKRYmRir92s
7. Demo - https://youtu.be/sx-AThKMskE

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

**Khushboo Chaudhari**  
AI Engineer | Data Analyst | Full-Stack AI Developer

- GitHub: [Add link]
- LinkedIn: [Add link]

## 🙏 Acknowledgments

- Groq for fast LLM inference
- Google AI for Vision and TTS capabilities
- Firebase for authentication services
- Cloudinary for media storage
- n8n for workflow orchestration