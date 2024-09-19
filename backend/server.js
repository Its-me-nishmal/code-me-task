import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import env from 'dotenv'


const app = express();
app.use(bodyParser.json());
app.use(cors());


env.config();

// Routes
app.use('/students', studentRoutes);
app.use('/attendance', attendanceRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Database connection error:', error);
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
