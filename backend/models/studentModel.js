import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: Number, required: true, unique: true },
});

export default mongoose.model('Student', studentSchema);
