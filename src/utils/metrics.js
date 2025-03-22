const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDurationSeconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

// Database connection metrics
const dbConnectionStatus = new promClient.Gauge({
  name: 'mongodb_connection_status',
  help: 'MongoDB connection status (1 for connected, 0 for disconnected)',
  registers: [register]
});

// User metrics
const userRegistrationTotal = new promClient.Counter({
  name: 'user_registration_total',
  help: 'Total number of user registrations',
  registers: [register]
});

const userLoginTotal = new promClient.Counter({
  name: 'user_login_total',
  help: 'Total number of user logins',
  registers: [register]
});

const activeUsers = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of active users in the system',
  registers: [register]
});

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  dbConnectionStatus,
  userRegistrationTotal,
  userLoginTotal,
  activeUsers
};