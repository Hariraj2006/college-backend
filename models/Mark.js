import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100
  },
  examType: {
    type: String,
    required: true,
    default: 'Internal'
  }
}, { timestamps: true });

export default mongoose.model('Mark', markSchema);
