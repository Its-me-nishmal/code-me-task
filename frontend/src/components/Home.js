import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from 'react-modal';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import './Home.css';  // Import custom CSS for styling

Modal.setAppElement('#root'); // For accessibility

const Home = () => {
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addStudentModalIsOpen, setAddStudentModalIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [status, setStatus] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRollNumber, setNewStudentRollNumber] = useState('');

  useEffect(() => {
    // Generate dates for the current month
    const generateMonthDates = (date) => {
      const start = new Date(date.getFullYear(), date.getMonth(), 2);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      const datesArray = [];

      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        datesArray.push(d.toISOString().split('T')[0]); // Format: YYYY-MM-DD
      }

      setDates(datesArray);
    };

    // Load dummy student data
    const loadDummyStudents = () => {
      const dummyData = [
        {
          id: '1',
          rollNumber: 1000,
          name: 'John Doe',
          attendance: {
            '2024-09-01': 'Present',
            '2024-10-05': 'Absent',
            '2024-09-15': 'Half-Day',
          },
        },
        {
          id: '2',
          rollNumber: 1001,
          name: 'Jane Smith',
          attendance: {
            '2024-09-02': 'Present',
            '2024-09-08': 'Present',
            '2024-09-20': 'Absent',
          },
        },
      ];

      setStudents(dummyData);
    };

    generateMonthDates(currentMonth);
    loadDummyStudents();
  }, [currentMonth]);

  const openModal = (student, date) => {
    setSelectedStudent(student);
    setSelectedDate(date);
    setStatus(student.attendance[date] || 'N/A');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setAddStudentModalIsOpen(false);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedStudent && selectedDate) {
      // Update the attendance status
      const updatedStudents = students.map(student => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            attendance: {
              ...student.attendance,
              [selectedDate]: newStatus,
            },
          };
        }
        return student;
      });
      setStudents(updatedStudents);
      closeModal();
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch('https://code-me-task.vercel.app/students/add', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStudentName
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      alert("Added Successfully")
      const newStudent = await response.json();
  
      setStudents([...students, newStudent]);
      closeModal();
    } catch (error) {
      alert('Something Wrong!!!')
    }
  };

  const attendanceBodyTemplate = (rowData, column) => {
    const date = column.field;
    const status = rowData.attendance[date] || 'N/A';

    return (
      <div onClick={() => openModal(rowData, date)} style={{ cursor: 'pointer' }}>
        {status === 'Present' && <i className="fas fa-check-circle green-icon"></i>}
        {status === 'Absent' && <i className="fas fa-times-circle red-icon"></i>}
        {status === 'Half-Day' && <i className="fa fa-hourglass-half orange-icon"></i>}
        {status === 'N/A' && <i className="fas fa-clock-half gray-icon"></i>}
      </div>
    );
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="card">
      <h2>Student List with Attendance</h2>
      <div className="month-navigation">
        <button onClick={() => handleMonthChange(-1)}>Previous Month</button>
        <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => handleMonthChange(1)}>Next Month</button>
      </div>
      <button onClick={() => setAddStudentModalIsOpen(true)} className="add-student-button">
        Add Student
      </button>
      <p></p>
      <i className="fas fa-check-circle green-icon"> Present </i>
      <i className="fas fa-times-circle red-icon"> Absent </i>
      <i className="fa fa-hourglass-half orange-icon"> Half Day </i>

      <p></p>

      <DataTable value={students} responsiveLayout="scroll" className="custom-table">
        <Column field="rollNumber" header="Roll No" sortable className="roll-column"></Column>
        <Column field="name" header="Name" sortable className="name-column"></Column>
        
        {/* Generate columns for the current month */}
        {dates.map((date) => (
          <Column
            key={date}
            field={date}
            header={<span>{new Date(date).getDate()}</span>}  // Show only the day
            body={attendanceBodyTemplate}
            className="attendance-column"
            style={{ minWidth: '50px', textAlign: 'center' }} // Adjust width and text alignment
          />
        ))}
      </DataTable>

      {/* Modal for updating attendance */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Update Attendance">
        <h2>Update Attendance for {selectedStudent?.name} on {selectedDate}</h2>
        <div>
          <button onClick={() => handleStatusChange('Present')}>Mark as Present</button>
          <button onClick={() => handleStatusChange('Absent')}>Mark as Absent</button>
          <button onClick={() => handleStatusChange('Half-Day')}>Mark as Half-Day</button>
        </div>
        <button onClick={closeModal}>Close</button>
      </Modal>

      {/* Modal for adding a new student */}
      <Modal isOpen={addStudentModalIsOpen} onRequestClose={closeModal} contentLabel="Add New Student">
        <h2>Add New Student</h2>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
            />
          </label>
          <label>
            Roll Number:
            <input
              type="number"
              value={newStudentRollNumber}
              onChange={(e) => setNewStudentRollNumber(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleAddStudent}>Add Student</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Home;
