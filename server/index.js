var express = require('express');
var config = require('../config');
var path = require('path');
var app = express();

app.use(express.static(path.resolve(__dirname + '/../public')));


var api = require('./api').init(app);


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
