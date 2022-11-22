const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./errors/not-found-error');
const errorsHandler = require('./errors/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

// eslint-disable-next-line no-useless-escape
const linkRegExp = /^(http|https):\/\/(www.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\.[\w\/]+#?/;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
  }),
}), createUser);

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {

});
