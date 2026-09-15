import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'hackathon-secret-key-sih26204',
  openaiApiKey:
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== 'your-openai-api-key-here' &&
    process.env.OPENAI_API_KEY.trim() !== ''
      ? process.env.OPENAI_API_KEY
      : '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCOjxp_raAGirIMsHic2GllWviWJw_VL0Y',
  googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY || 'AIzaSyAGMrsvzjRTGEcu5o_XPNnPHFuZUytrYRU',
  googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
};
