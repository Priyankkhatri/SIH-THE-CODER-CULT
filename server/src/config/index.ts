import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'hackathon-secret-key-sih26204',
  groqApiKey:
    process.env.GROQ_API_KEY &&
    process.env.GROQ_API_KEY.trim() !== ''
      ? process.env.GROQ_API_KEY.trim()
      : '',
  groqModel: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
};
