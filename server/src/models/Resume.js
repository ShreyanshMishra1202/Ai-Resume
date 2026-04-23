import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    education: { type: String, trim: true },
    skills: { type: String, trim: true },
    experience: { type: String, trim: true },
    projects: { type: String, trim: true },
    summary: { type: String, trim: true }
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
