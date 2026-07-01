import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  photoUrl: { type: String },
  linkedinUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Alumni', alumniSchema);
