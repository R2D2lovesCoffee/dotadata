const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');

app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/api', router);

module.exports = app;