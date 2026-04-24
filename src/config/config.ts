export const config = {
  port: Number(process.env.PORT || 3001),
  env: process.env.NODE_ENV || 'development',
  productionUrl: process.env.PRODUCTION_URL || 'https://hbsb-limpio.vercel.app',
  groqApiKey: process.env.GROQ_API_KEY || '',
  cors: {
    origins: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['*']
  }
} as const;
