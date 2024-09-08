import express from 'express';
import { addCollege, getAllColleges, checkCollegeRegistration } from '../controllers/collegeController';

const router = express.Router();

router.post('/add', addCollege);
router.get('/', getAllColleges);
router.get('/check-college/:collegeId', checkCollegeRegistration);
router.get('/colleges/search', getAllColleges);

export default router;
