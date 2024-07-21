const { env } = process;

const config = {
  port: +env.PORT || 8795,
  jwtSecretKey: env.JWT_SECRET_KEY,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  email: {
    port: env.EMAIL_PORT,
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    host: env.EMAIL_HOST,
  },
};

module.exports = config;
