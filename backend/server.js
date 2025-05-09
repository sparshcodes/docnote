import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import path from 'path';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors({
  origin: ['https://docnote-eight.vercel.app', 'http://localhost:5173','https://docnote-4qzx.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin); // Allow the origin dynamically
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    return res.status(200).json({}); // Respond with HTTP 200 for preflight
  }
  next();
});

// Handle preflight requests
app.options('*', cors());

// api end point
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

app.get('/', (req, res) => {
  res.send('Api working...');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Export the app for Vercel
module.exports = app;