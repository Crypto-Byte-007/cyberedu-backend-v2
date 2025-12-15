export default () => ({
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberedu',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/cyberedu_test',
  },

  // JWT - ADD THIS SECTION
  jwt: {
    secret: process.env.JWT_SECRET || 'change_this_in_production',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logToFile: process.env.LOG_TO_FILE === 'true',
  },
});