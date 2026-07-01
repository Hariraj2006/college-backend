import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  title: { type: String, required: true },
  event: { type: String, required: true },
  details: { type: String },
  photoUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
