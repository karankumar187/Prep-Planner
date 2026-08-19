require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Robust CORS configuration for Vercel deployment
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins (Vercel frontend, local dev, postman)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Enable pre-flight for all routes
app.options('*', cors());

app.use(express.json());

// Root & Health Check Endpoints for Render
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Placement Prep Tracker API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).send('Placement Tracker API is running cleanly');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedules', authMiddleware, require('./routes/schedules'));
app.use('/api', authMiddleware, require('./routes/tasks'));
app.use('/api/enrollments', authMiddleware, require('./routes/enrollments'));
app.use('/api/progress', authMiddleware, require('./routes/progress'));
app.use('/api/analytics', authMiddleware, require('./routes/analytics'));
app.use('/api/ai', authMiddleware, require('./routes/ai'));

// Global 404 Handler for API routes with CORS support
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Endpoint not found' });
});

// Serve static files if client is built inside server directory
if (process.env.NODE_ENV === 'production' && require('fs').existsSync(path.join(__dirname, '../client/dist'))) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
