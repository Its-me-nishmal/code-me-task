import Student from '../models/studentModel.js';

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
      
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
