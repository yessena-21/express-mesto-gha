const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { URL_BAD_REQUESTS } = require('./errors/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6362cf78cb5eae00e5797cc6', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(bodyParser.json());
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(URL_BAD_REQUESTS).send({ message: 'Страница не найдена' });
});
app.listen(PORT, () => {

});
