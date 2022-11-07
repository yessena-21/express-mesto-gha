const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  console.log('все юзеры');
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(400).send({ message: 'Переданы некоррекные данные' }));
};
module.exports.getUserByID = (req, res) => {
  console.log('1 юзеры');
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    },
  ).then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: 'Запрашиваемый пользователь не найден' }));
};

module.exports.updateUseravatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  ).then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: 'Запрашиваемый пользователь не найден' }));
};
