var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require('async');
var config = require('../../config');


module.exports = {
    register: function(req, res) {
        var body = req.body;
        res.send(req.body);

    },
    detail: function(req, res) {
    	res.send("hotel details");
    }
}
