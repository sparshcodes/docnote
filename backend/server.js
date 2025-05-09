import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import serverless from 'serverless-http';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// ✅ CORS middleware
app.use(
  cors({
    origin: [
      'https://docnote-eight.vercel.app',
      'https://docnote-4qzx.vercel.app',
      'http://localhost:5173',
      'https://docnote-4qzx-git-main-sparshcodes-projects.vercel.app',
      'https://docnote-4qzx-jh6tmfwy9-sparshcodes-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('/', (req, res) => {
  res.send('API working...');
});

// ✅ Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// ✅ Vercel export
export const handler = serverless(app);
