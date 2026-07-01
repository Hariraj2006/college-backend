import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
// app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

// AI Chatbot Route
app.post('/api/chat', (req, res) => {
  const message = req.body.message || '';
  const text = message.toLowerCase();
  
  let reply = "I'm a college assistant AI. I'm not sure about that. Please contact the department.";
  
  if (text.includes('hello') || text.includes('hi')) {
    reply = "Hello there! I am the College AI Assistant. How can I help you today?";
  } else if (text.includes('attendance')) {
    reply = "You can view your attendance by logging in as a student and visiting the 'Attendance' tab on your dashboard.";
  } else if (text.includes('assignment') || text.includes('homework')) {
    reply = "Assignments are posted by your professors. Please check the 'Assignments' section in your dashboard for due dates.";
  } else if (text.includes('material') || text.includes('notes')) {
    reply = "Study materials and notes are available in the 'Materials' section of your student dashboard. You can download them there.";
  } else if (text.includes('course') || text.includes('syllabus')) {
    reply = "You can find all course-related information and syllabi under the 'Courses' section on our homepage.";
  } else if (text.includes('admin') || text.includes('staff') || text.includes('teacher')) {
    reply = "Staff details are listed in the 'Staff Details' section. If you need admin access, please contact the IT department.";
  }

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
