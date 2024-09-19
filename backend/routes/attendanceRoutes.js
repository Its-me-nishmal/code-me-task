import express from 'express';
import { markAttendance, getAttendanceReport } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/mark', markAttendance);
router.get('/report/', getAttendanceReport);

export default router;
