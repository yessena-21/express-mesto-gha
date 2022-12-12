// const jwt = require('jsonwebtoken');
// const { AuthError } = require('../errors/auth-error');

// module.exports = (req, res, next) => {
//   // console.log(req.headers);
// const { authorization } = req.cookie;
// console.log(authorization);
// if (!authorization || !authorization.startsWith('Bearer ')) {
//   return next(new AuthError('Необходима авторизация'));
// }

// const token = authorization.replace('Bearer ', '');

// const token = req.cookies.jwt;
// if (!token) {
//   throw new AuthError('Необходима авторизация');
// }
// let payload;

// try {
//   payload = jwt.verify(token, 'some-secret-key');
//   req.user = payload; // записываем пейлоуд в объект запроса
// } catch (err) {
//   return next(new AuthError('Необходима авторизация'));
//   // throw new AuthError('Необходима авторизация');
// }

// return next(); // пропускаем запрос дальше
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    req.user = payload; // записываем пейлоуд в объект запроса
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
    // throw new AuthError('Необходима авторизация');
  }

  return next(); // пропускаем запрос дальше
};
