const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @desc    Basic health check
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date()
  });
});

/**
 * @desc    Detailed health check
 * @route   GET /api/health/detailed
 * @access  Public
 */
router.get('/detailed', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
  
  // Get memory usage
  const memoryUsage = process.memoryUsage();
  
  // Get uptime
  const uptime = process.uptime();
  
  res.status(200).json({
    service: 'todo-user-service',
    status: 'UP',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date(),
    details: {
      database: {
        status: dbStatus
      },
      system: {
        uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
        }
      }
    }
  });
});

module.exports = router;