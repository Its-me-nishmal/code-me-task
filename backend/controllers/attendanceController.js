import Attendance from '../models/attendanceModel.js';

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const attendance = new Attendance({ student: studentId, date, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const report = await Attendance.find({ student: studentId });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
