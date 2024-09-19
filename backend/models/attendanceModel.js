import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Half-Day', 'Absent'], default: 'Present' },
});

export default mongoose.model('Attendance', attendanceSchema);
