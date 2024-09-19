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
    const attendanceRecords = await Attendance.find({ student: studentId });

    // Initialize counters
    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;

    // Process each attendance record
    attendanceRecords.forEach(record => {
      const status = record.status; // Adjust this if your status field is named differently

      switch (status) {
        case 'Present':
          presentCount++;
          break;
        case 'Absent':
          absentCount++;
          break;
        case 'Half-Day':
          halfDayCount++;
          break;
        default:
          break;
      }
    });

    // Convert half-day count to full-day equivalents
    const totalDays = presentCount + absentCount + Math.floor(halfDayCount / 2);

    // Prepare the report
    const report = {
      present: presentCount,
      absent: absentCount,
      halfDay: halfDayCount,
      totalDays // Total days considering half-day adjustments
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fulldata = async (req, res) => {
  try {

    const attendanceRecords = await Attendance.find().populate('student')
   // Initialize counters
   let presentCount = 0;
   let absentCount = 0;
   let halfDayCount = 0;
   let students = []

   // Process each attendance record
   attendanceRecords.forEach(record => {

    students.push(record.student.name)
     const status = record.status; // Adjust this if your status field is named differently

     switch (status) {
       case 'Present':
         presentCount++;
         break;
       case 'Absent':
         absentCount++;
         break;
       case 'Half-Day':
         halfDayCount++;
         break;
       default:
         break;
     }
   });

   // Convert half-day count to full-day equivalents
   const totalDays = presentCount + absentCount + Math.floor(halfDayCount / 2);

   // Prepare the report
   const report = {
     present: presentCount,
     absent: absentCount,
     halfDay: halfDayCount,
     totalDays // Total days considering half-day adjustments
   };
   console.log(students,report);

   res.status(200).json({report,students});
  } catch (e) {
    res.status(500).json({message: error.message})
  }
}