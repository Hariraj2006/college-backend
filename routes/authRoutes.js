import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'student') {
      const student = await Student.findOne({ email });
      if (!student) return res.status(404).json({ message: 'Student not found with this email' });
      
      // Use the model's matchPassword method to compare hashed passwords
      const isMatch = await student.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
      return res.status(200).json({ token, user: student });
    } 
    
    if (role === 'admin') {
      // Hardcoded master admin fallback
      if ((email === 'admin@college.edu' || email === 'admin@gmail.com') && password === 'admin123') {
        const token = jwt.sign({ id: 'master_admin', role: 'admin' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
        return res.status(200).json({ token, user: { name: 'Master Admin', role: 'admin' } });
      }

      const staff = await Staff.findOne({ email });
      if (!staff) return res.status(404).json({ message: 'Admin/Staff not found with this email' });
      
      const isMatch = await staff.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: staff._id, role: 'admin' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
      return res.status(200).json({ token, user: staff });
    }

    return res.status(400).json({ message: 'Invalid role specified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
