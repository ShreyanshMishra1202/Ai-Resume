import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_CLIENT_ORIGINS = [
  'https://ai-resume-six-rho.vercel.app',
  'http://localhost:5173'
];

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigins: (process.env.CLIENT_ORIGIN || DEFAULT_CLIENT_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  mongoUri: process.env.MONGODB_URI || ''
};
