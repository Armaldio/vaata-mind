const isProduction = process.env.NODE_ENV === 'production';

// eslint-disable-next-line import/prefer-default-export
export const redirectURL = isProduction
  ? 'https://vaata-mind.vercel.app'
  : 'http://localhost:3000';
