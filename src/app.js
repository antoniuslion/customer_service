const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const { catchAll, notFound } = require('./error/error');
const customerRouter = require('./router/customers');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'It works!!!' });
});

app.use('/customers', customerRouter);

app.use(notFound);
app.use(catchAll);

module.exports = app;