const devConfig = {
  jwtSecret: 'Ne!lC^fferry_wc0!!ar',
  tokenExpiry: '24h',
  refreshTokenExpiry: '24h'
};

const prodConfig = {
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiry: '24h',
  refreshTokenExpiry: '24h'
};

const config = process.env.IS_PROD ? prodConfig : devConfig;

module.exports = config;