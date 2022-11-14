const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const {
  NOT_FOUND_USER,
  SERVER_ERROR,
  INCORRECT_DATA,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректные данные запроса' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректный ID' });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_USER).send({ message: `${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
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
        res.status(INCORRECT_DATA).send({ message: 'Некорректные данные запроса' });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_USER).send({ message: `${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUseravatar = (req, res) => {
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
        res.status(INCORRECT_DATA).send({ message: 'Некорректные данные запроса' });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_USER).send({ message: `${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
