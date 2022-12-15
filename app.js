require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./errors/not-found-error');
const errorsHandler = require('./errors/errorHandler');
const auth = require('./middlewares/auth');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const options = {
  origin: [
    'http://localhost:3000',
    'http://yessena.nomoredomains.club',
    'https://yessena.nomoredomains.club',
  ],
  // methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  // preflightContinue: false,
  // optionsSuccessStatus: 204,
  // allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));
app.use(limiter);
app.use(cookieParser());

app.use(bodyParser.json());

app.use(requestLogger);
app.use(helmet());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(routes);

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {

});
