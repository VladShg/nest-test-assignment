export const constants = {
  sessionSecret: process.env.SESSION_KEY || 'session',
  tokenSecret: process.env.TOKEN_SECRET || 'token',
  origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
};
