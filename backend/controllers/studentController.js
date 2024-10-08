import Student from '../models/studentModel.js';
import Attendance from '../models/attendanceModel.js';

export const addStudent = async (req, res) => {
  try {
    const { name } = req.body; // No rollNumber in the request body
  
    // Fetch the last student entry to get the last roll number
    const lastStudent = await Student.findOne().sort({ rollNumber: -1 });
    
    // Calculate the new roll number
    const newRollNumber = lastStudent ? lastStudent.rollNumber + 1 : 1000;
  
    // Create a new student with the incremented roll number
    const student = new Student({ name, rollNumber: newRollNumber });
    await student.save();
    
    // Create an attendance entry for today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const attendance = new Attendance({
      student: student._id,
      date: today,
      status: 'Present'
    });
    await attendance.save();
    
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    // Fetch all students
    const students = await Student.find();
    
    // Create a list of students with their attendance
    const studentWithAttendance = await Promise.all(students.map(async (student) => {
      // Fetch attendance records for the student
      const attendanceRecords = await Attendance.find({ student: student._id });
      
      // Format attendance records into an object
      const attendance = {};
      attendanceRecords.forEach(record => {
        const date = record.date.toISOString().split('T')[0]; // YYYY-MM-DD format
        attendance[date] = record.status;
      });
      
      // Return formatted student object
      return {
        id: student._id.toString(),
        rollNumber: student.rollNumber,
        name: student.name,
        attendance
      };
    }));
    
    // Send the response
    res.status(200).json(studentWithAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

