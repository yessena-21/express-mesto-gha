const Card = require('../models/card');
const { NotFoundError } = require('../errors/not-found-error');
const {
  NOT_FOUND_ARTICLE,
  SERVER_ERROR,
  INCORRECT_DATA,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректные данные запроса' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('Карточка по указанному id не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректный ID карточки' });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_ARTICLE).send({ message: 'Запрашиваемая  карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new NotFoundError('Карточка по указанному id не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректный ID карточки' });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_ARTICLE).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new NotFoundError('Карточка по указанному id не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректный ID карточки' });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_ARTICLE).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
