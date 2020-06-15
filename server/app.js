const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
const fileupload = require("express-fileupload");

app.use(fileupload());
app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/api', router);
app.use('/profile_pics', express.static(__dirname + '/database/profile_pics'));

module.exports = app;