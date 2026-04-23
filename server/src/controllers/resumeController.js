import Resume from '../models/Resume.js';

export async function createResume(req, res, next) {
  try {
    const resume = await Resume.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
}

export async function listResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
}

export async function getResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    res.json(resume);
  } catch (error) {
    next(error);
  }
}

export async function updateResume(req, res, next) {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    res.json(resume);
  } catch (error) {
    next(error);
  }
}

export async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
