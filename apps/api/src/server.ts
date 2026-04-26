import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import dataRoutes from './routes/data';
import userRoutes from './routes/users';
import seminarRoutes from './routes/seminars';
import progressRoutes from './routes/progress';
import availabilityRoutes from './routes/availability';
import pilotRoutes from './routes/pilot';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware (must come before helmet)
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://cara-versel-m6khqpy64-tokumas-projects.vercel.app',
      'https://cara-versel-api.vercel.app',
      'http://localhost:3000',
      'https://cara-versel.onrender.com'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Security middleware (after CORS)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/v1', dataRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/seminars', seminarRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/pilot', pilotRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'PhD Seminar Management API',
    version: '1.0.0'
  });
});

// Test endpoint for frontend-backend communication
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Backend is responding correctly!',
    timestamp: new Date().toISOString(),
    service: 'PhD Seminar Management API',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
  console.log(`📊 API available at: http://localhost:${PORT}/api/v1`);
  console.log(`🎓 PhD Seminar Management System initialized`);
});
