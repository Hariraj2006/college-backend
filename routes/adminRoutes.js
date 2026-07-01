import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Course from '../models/Course.js';
import Staff from '../models/Staff.js';
import Alumni from '../models/Alumni.js';
import Achievement from '../models/Achievement.js';
import Student from '../models/Student.js';
import Material from '../models/Material.js';
import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';
import Marks from '../models/Marks.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// GET Endpoints
router.get('/courses', async (req, res) => res.json(await Course.find()));
router.get('/staff', async (req, res) => res.json(await Staff.find()));
router.get('/alumni', async (req, res) => res.json(await Alumni.find()));
router.get('/achievements', async (req, res) => res.json(await Achievement.find()));
router.get('/students', async (req, res) => res.json(await Student.find()));
router.get('/assignments', async (req, res) => res.json(await Assignment.find()));
router.get('/materials', async (req, res) => res.json(await Material.find()));
router.get('/attendance', async (req, res) => res.json(await Attendance.find().populate('student')));
router.get('/marks', async (req, res) => res.json(await Marks.find().populate('student')));

// DELETE Endpoints helper
const addDeleteRoute = (routePath, Model) => {
  router.delete(`${routePath}/:id`, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

addDeleteRoute('/courses', Course);
addDeleteRoute('/staff', Staff);
addDeleteRoute('/alumni', Alumni);
addDeleteRoute('/achievements', Achievement);
addDeleteRoute('/students', Student);
addDeleteRoute('/assignments', Assignment);
addDeleteRoute('/materials', Material);
addDeleteRoute('/attendance', Attendance);
addDeleteRoute('/marks', Marks);

// API Endpoints
router.post('/courses', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'material', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const photoUrl = req.files && req.files['photo'] ? `/uploads/${req.files['photo'][0].filename}` : null;
    const materialUrl = req.files && req.files['material'] ? `/uploads/${req.files['material'][0].filename}` : null;
    
    const course = await Course.create({ title, description, photoUrl, materialUrl });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For Staff, let's just create a new staff record
router.post('/staff', upload.single('photo'), async (req, res) => {
  try {
    const { name, designation, description } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    // We mock staffId, email, password, and department since the frontend form only has name, designation, description
    const staffId = `STF${Date.now()}`;
    const email = `${staffId}@college.edu`;
    const password = 'password123';
    const department = 'Computer Science';

    const staff = await Staff.create({ staffId, name, email, password, department, designation, description, photoUrl });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/alumni', upload.single('photo'), async (req, res) => {
  try {
    const { name, batch, company, role, description, linkedinUrl } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const alumni = await Alumni.create({ name, batch, company, role, description, photoUrl, linkedinUrl });
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/achievements', upload.single('photo'), async (req, res) => {
  try {
    const { studentName, title, event, details } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const achievement = await Achievement.create({ studentName, title, event, details, photoUrl });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/students', upload.none(), async (req, res) => {
  try {
    const { name, registerNumber, email, year, password } = req.body;
    const student = await Student.create({ 
      name, 
      registerNumber, 
      email, 
      password: password || 'password123', 
      department: 'Computer Science', 
      year: parseInt(year) || 1 
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/materials', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const material = await Material.create({ title, fileUrl });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/assignments', upload.none(), async (req, res) => {
  try {
    const { title, subject, description, dueDate } = req.body;
    const assignment = await Assignment.create({ title, subject, description, dueDate });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/attendance', upload.none(), async (req, res) => {
  try {
    const { studentRegNo, subject, month, totalWorkingDays, presentDays, absentDays } = req.body;
    const student = await Student.findOne({ registerNumber: studentRegNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found with this Register Number' });
    }

    const attendance = await Attendance.create({
      student: student._id,
      subject,
      month,
      totalWorkingDays: parseInt(totalWorkingDays),
      presentDays: parseInt(presentDays),
      absentDays: parseInt(absentDays)
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/marks', upload.none(), async (req, res) => {
  try {
    const { studentRegNo, subject, examType, score, maxScore } = req.body;
    const student = await Student.findOne({ registerNumber: studentRegNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found with this Register Number' });
    }

    const marks = await Marks.create({
      student: student._id,
      subject,
      examType,
      score: Number(score),
      maxScore: Number(maxScore)
    });
    res.status(201).json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
