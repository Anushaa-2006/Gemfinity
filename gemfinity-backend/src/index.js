require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'Gemfinity Jewellery Savings App REST API',
    status: 'online',
    message: '✨ Welcome to Gemfinity Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      schemes: '/api/schemes',
      payments: '/api/payments',
      collections: '/api/collections',
      rewards: '/api/rewards',
      certificates: '/api/certificates'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Gemfinity REST API Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/certificates', certificateRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
  ✨ Gemfinity Jewellery Savings App Backend Server
  🚀 Listening on http://localhost:${PORT}
  💎 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});
