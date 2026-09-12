import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_OAI_KEY = Buffer.from(
  'c2stcHJvai1ZSGxBZWdQSG4tMk9vS2RhbjgyRWo0XzBnU2Y1SGs1RWcxdWtjYWJCNjRFWDg1eERORHVmQ0d3M2p5ay1XT09yTThzdng2a3p0aVRUM0JsYmtGSkxqS2N2VG5pWF9lbS1VVHB3WVhla1M2Q3RRdG1ldV91LXVSV1RnTUlXQXROZEVmd2wwRnZfbmpFNmhCRXhvZFQtd1otY3FTOWNB',
  'base64'
).toString('utf-8');

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'hackathon-secret-key-sih26204',
  openaiApiKey:
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== 'your-openai-api-key-here' &&
    process.env.OPENAI_API_KEY.trim() !== ''
      ? process.env.OPENAI_API_KEY
      : DEFAULT_OAI_KEY,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCOjxp_raAGirIMsHic2GllWviWJw_VL0Y',
  googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY || 'AIzaSyAGMrsvzjRTGEcu5o_XPNnPHFuZUytrYRU',
  googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
};
