import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
