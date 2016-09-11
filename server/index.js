var express = require('express');
var config = require('../config');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname + '/../public')));


var api = require('./api').init(app);
var restaurant = require('./restaurant').init(app);
// var user = require('./')
app.get('/ping', (req, res) => {
    res.send("pong");
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

app.get('/*', (req, res) => {
    res.redirect('/');
});

module.exports = app;
