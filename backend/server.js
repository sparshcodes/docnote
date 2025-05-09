import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// ✅ CORS setup with all Vercel domains
app.use(cors({
  origin: [
    'https://docnote-eight.vercel.app',
    'http://localhost:5173',
    'https://docnote-4qzx.vercel.app',
    'https://docnote-4qzx-git-main-sparshcodes-projects.vercel.app',
    'https://docnote-4qzx-jh6tmfwy9-sparshcodes-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('/', (req, res) => {
  res.send('Api working...');
});

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// ✅ Vercel handler with preflight OPTIONS support
const handler = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end(); // ✅ 204 for preflight
  }

  return app(req, res);
};

export default handler;
