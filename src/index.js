const mongoose = require('mongoose');
const winston = require('winston');

const app = require('./app');
const config = require('./database/config');

mongoose.connect(config.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
  winston.info('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
  winston.info('Mongoose disconnected!');
});

mongoose.connection.on('error', (err) => {
  winston.error(err.message);
});

app.listen(config.PORT, () => {
  Object.keys(config).forEach((key) => winston.info(`${key}: ${config[key]}`));
});