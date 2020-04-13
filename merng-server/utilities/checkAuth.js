const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const { SECRET_KEY } = require('../SECTRET_ENV');
module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invlid/Expired token');
      }
    } else {
      throw new Error('Auth token must be in proper format');
    }
  } else {
    throw new Error('Auth header must be provided ');
  }
};
