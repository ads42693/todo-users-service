const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const config = require('./config');

// Set port
const port = process.env.PORT || 3000;
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Graceful shutdown function
const shutdown = () => {
  logger.info('Shutting down server...');
  server.close((err) => {
    if (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
    
    logger.info('Server shutdown complete');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
};

// Event listeners for graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

module.exports = server; // For testing purposes