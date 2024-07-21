const config = require("../../config");
const { verify, sign } = require("jsonwebtoken");

const createToken = (payload) => {
  return sign(payload, config.jwtSecretKey, { expiresIn: config.jwtExpiresIn });
};

const checkToken = (token, callback) => {
  return verify(token, config.jwtSecretKey, callback);
};

module.exports = {
  createToken,
  checkToken,
};
