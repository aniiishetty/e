import express from 'express';
import upload from '../middleware/upload'; // Adjust the path if needed
import { registerUser, getAllRegistrations } from '../controllers/registrationController';

const router = express.Router();

// Apply the upload middleware to handle file uploads
router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'researchPaper', maxCount: 1 }]), registerUser);
router.get('/', getAllRegistrations);

export default router;
