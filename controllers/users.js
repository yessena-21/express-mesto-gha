const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { CastError } = require('../errors/cast-error');
const { ValidationError } = require('../errors/validation-error');
const { ExistFieldError } = require('../errors/exist-field-error');
const { NotFoundError } = require('../errors/not-found-error');
const { AuthError } = require('../errors/auth-error');

// const {
//   NOT_FOUND_USER,
//   SERVER_ERROR,
//   INCORRECT_DATA,
// } = require('../errors/errors');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) return next(new AuthError('Неверный email или пароль'));

        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

        return res.send({ token });
      });
    }).catch(() => {
      next(new AuthError('Неверный email или пароль'));
    });
};
//   // создадим токен
//   const token = jwt.sign({ id: user._id }, 'some-secret-key', { expiresIn: '7d' });
//   // вернём токен
//   // res
//   //   .cookie('jwt', token, {
//   //   // token - наш JWT токен, который мы отправляем
//   //     maxAge: 3600000 * 24 * 7,
//   //     httpOnly: true,
//   //   });
//   res.send({ token });
// }

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    // вернём записанные в базу данные
    .then((user) => res.send({
      id: user._id, name: user.name, avatar: user.avatar, about: user.about,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ExistFieldError('Email уже существует'));
      } else {
        next(err);
      }
    });
};
const getUserByID = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      // } else if (err instanceof NotFoundError) {
      //   res.status(NOT_FOUND_USER).send({ message: `${err.message}` });
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      // } else if (err instanceof NotFoundError) {
      //   res.status(NOT_FOUND_USER).send({ message: `${err.message}` });
      } else {
        // res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
        next(err);
      }
    });
};
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      runValidators: true,
      new: true,
    },
  ).orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(INCORRECT_DATA).send({ message: 'Некорректные данные запроса' });
        next(new ValidationError('Некорректные данные запроса'));
      // } else if (err instanceof NotFoundError) {
      //   res.status(NOT_FOUND_USER).send({ message: `${err.message}` });
      } else {
        // res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
        next(err);
      }
    });
};

const updateUseravatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные запроса'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  getUserInfo,
  getUsers,
  updateUser,
  updateUseravatar,
  getUserByID,
  createUser,
};
