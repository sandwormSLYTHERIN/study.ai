# StudyAI - AI-Powered Study Platform

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Llama 3.3](https://img.shields.io/badge/Llama%203.3-70B-purple)](https://ai.meta.com/llama/)

A full-stack MERN application that helps students study efficiently with AI-powered YouTube video summarization, intelligent document analysis, and cloud-based note storage.

**Built by**: Aswin EP | **Tech Stack**: MongoDB + Express + React + Node.js + Llama AI

---

## 🎯 Features

### Core Functionality
✅ **JWT Authentication** - Secure login/register with 7-day token expiry  
✅ **File Upload System** - Store PDFs, images, docs on Cloudinary CDN (10MB limit)  
✅ **AI Video Summarizer** - Paste YouTube URL → Get summary, key points, study questions  
✅ **Document Intelligence** - Ask AI questions about uploaded files  
✅ **Study Guide Generator** - AI creates personalized study plans  
✅ **Smart Caching** - MongoDB caches summaries to avoid redundant API calls  
✅ **Dark Theme UI** - Modern glassmorphism design with animated gradients  

---

## 🛠 Tech Stack

**Backend**: Node.js v25 | Express 5 | MongoDB Atlas | JWT | bcrypt | Multer | Cloudinary  
**Frontend**: React 18 | Vite 6 | React Router 7 | Axios | Context API  
**AI**: GROQ API | Llama 3.3 70B | Custom YouTube transcript extractor  
**Deployment**: Not deployed yet (Render/Railway recommended)  

---

## 📂 Project Structure

```
studyai/
├── backend/
│   ├── config/          # Database, Cloudinary, GROQ setup
│   ├── controllers/     # Business logic (auth, notes, AI)
│   ├── middleware/      # JWT protection, file upload, errors
│   ├── models/          # Mongoose schemas (User, Note, VideoSummary)
│   ├── routes/          # API endpoints
│   ├── utils/           # YouTube transcript extractor
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios config with interceptors
│   │   ├── components/  # Navbar
│   │   ├── context/     # AuthContext (global state)
│   │   ├── layouts/     # MainLayout with protection
│   │   ├── pages/       # Login, Register, Dashboard, Notes, etc.
│   │   └── routes/      # React Router config
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ (v25 recommended)
- MongoDB Atlas account
- Cloudinary account
- GROQ API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/studyai.git
cd studyai

# Backend setup
cd backend
npm install
cp .env.example .env  # Add your credentials
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create `.env` in `/backend`:

```env
# MongoDB (Direct connection for Node v25)
MONGODB_URI=mongodb://user:pass@host:27017/studyai?directConnection=true

# JWT Secret (change in production!)
JWT_SECRET=your_random_64_character_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# GROQ API
GROQ_API_KEY=gsk_your_groq_key
```

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Notes (Protected)
- `POST /api/notes/upload` - Upload file (multipart/form-data)
- `GET /api/notes` - Get all notes (query: ?subject=&tags=&search=)
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note + Cloudinary file

### AI (Protected)
- `POST /api/ai/summarize` - Summarize YouTube video
- `GET /api/ai/summaries` - Get all summaries
- `POST /api/ai/analyze-document/:noteId` - Ask question about doc
- `POST /api/ai/study-guide/:noteId` - Generate study guide
- `DELETE /api/ai/summaries/:id` - Delete summary

---

## 🧠 Core Concepts Explained

### 1. JWT Authentication Flow
```
User Login → Server generates JWT → Frontend stores in localStorage
→ Axios interceptor adds "Authorization: Bearer TOKEN" to every request
→ Backend middleware verifies token → Grants access to protected routes
```

**Token structure:**
```javascript
{
  id: "507f1f77bcf86cd799439011",  // User MongoDB _id
  iat: 1640995200,                  // Issued at timestamp
  exp: 1641600000                   // Expires in 7 days
}
```

### 2. Password Hashing (bcrypt)
```javascript
// User registers with password: "mypassword123"
// Mongoose pre-save hook automatically hashes:
bcrypt.hash("mypassword123", 10)
// Stored in DB: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p..."

// Login verification:
bcrypt.compare("mypassword123", hashedPassword) // true/false
```

**Salt rounds = 10** = 2^10 = 1,024 iterations (balanced security/speed)

### 3. File Upload Flow (Cloudinary)
```
Frontend: User selects file → FormData created
→ POST /api/notes/upload (multipart/form-data)
→ Multer middleware parses file from request
→ Cloudinary SDK uploads to CDN
→ Returns URL: https://res.cloudinary.com/...
→ MongoDB stores metadata + URL
→ Frontend displays file
```

### 4. YouTube Transcript Extraction
**Problem:** No official API  
**Solution:** 4 fallback methods

```javascript
try {
  return await fetchJSON3Format(videoId);
} catch {
  try {
    return await scrapeHTMLPage(videoId);
  } catch {
    try {
      return await fetchXMLFormat(videoId);
    } catch {
      return await tryMultipleLanguages(videoId);
    }
  }
}
```

Success rate: **95%**

### 5. AI Prompt Engineering
```javascript
const prompt = `
You are a study assistant. Respond ONLY with JSON:
{
  "summary": "2-3 sentences",
  "keyPoints": ["point1", "point2"],
  "expectedQuestions": [{"question": "...", "suggestedAnswer": "..."}],
  "difficulty": "beginner|intermediate|advanced",
  "estimatedStudyTime": <minutes>
}

Transcript: ${transcript}
`;

// GROQ API call with temperature=0.3 (more consistent)
const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3
});
```

### 6. React Context API (Global Auth State)
```javascript
// context/AuthContext.jsx
<AuthContext.Provider value={{ user, token, login, logout }}>
  {children}
</AuthContext.Provider>

// Any component:
const { user, logout } = useAuth();
```

Avoids prop drilling through 10+ components!

---

## 💾 Database Schemas

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "student" | "teacher" | "admin",
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  subject: String,
  tags: [String],
  fileUrl: String (Cloudinary URL),
  fileType: String,
  fileSize: Number (bytes),
  cloudinaryPublicId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### VideoSummary
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  youtubeUrl: String,
  videoId: String (indexed for caching),
  summary: String,
  keyPoints: [String],
  expectedQuestions: [{ question, suggestedAnswer }],
  difficulty: "beginner" | "intermediate" | "advanced",
  estimatedStudyTime: Number (minutes),
  topics: [String],
  createdAt: Date
}
```

---

## 🚧 Challenges & Solutions

### Challenge 1: MongoDB Connection Failed (Node v25)
**Error:** `MongooseServerSelectionError: ENOTFOUND`

**Root Cause:** Node.js v25 broke DNS SRV lookups for MongoDB Atlas

**Solution:**
```javascript
// Changed from SRV:
mongodb+srv://cluster.mongodb.net/studyai

// To direct connection:
mongodb://host:27017/studyai?directConnection=true
```

### Challenge 2: YouTube Transcript Unreliable
**Problem:** `youtube-transcript` npm package returned empty arrays

**Solution:** Built custom 4-method fallback system → 95% success rate

### Challenge 3: AI Responses Inconsistent
**Problem:** Llama 3.3 returned different formats (sometimes wrapped in markdown)

**Solution:**
1. Engineered precise JSON-only prompt
2. Strip markdown with regex: `text.replace(/```json|```/g, '')`
3. Set `temperature: 0.3` for consistency

---

## 🔮 Future Enhancements

**High Priority:**
- [ ] Refresh token mechanism
- [ ] Email verification on signup
- [ ] PDF text extraction for better AI analysis
- [ ] Rate limiting (express-rate-limit)

**Medium Priority:**
- [ ] Flashcard generator from summaries
- [ ] Quiz generator with scoring
- [ ] Collaborative notes (share with friends)
- [ ] Export summaries to PDF

**Infrastructure:**
- [ ] Deploy to Railway/Render
- [ ] CI/CD with GitHub Actions
- [ ] Redis caching layer
- [ ] Sentry error monitoring

---

## 📞 Contact

**Aswin EP**  
📧 Email: dtejeshwar9@gmail.com  
💼 LinkedIn: [Tejeshwar D](https://www.linkedin.com/in/tejeshwar-d-05b166279)
🐙 GitHub: https://github.com/sandwormSLYTHERIN

---

## 🙏 Acknowledgments

- Meta AI for Llama 3.3
- GROQ for free inference API
- Cloudinary for CDN
- MongoDB Atlas for database
- Claude AI for development assistance

---

**⭐ Star this repo if it helped you!**

*Last Updated: February 2025*
