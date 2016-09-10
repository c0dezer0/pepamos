var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require('async');
var config = require('../../config');

// generalising the output format
var output = (err, data) => {
    return {
        error: err || '',
        data: data || ''
    };
}
// change string number to interger number 
var compileToInt = function(query) {
    for (key in query) {
        if (!isNaN(query[key])) {
            query[key] = Number(query[key]);
        }
    }
    return query;
}

var convertRegex = function(query){
	var arr =[];
	for(key in query){
		if(typeof(query[key])=='string'){
			query[key] = {
				$regex : query[key],
				$options : 'i'
			}
		}
		arr.push({[key]: query[key]});
	}
	return arr;
}

module.exports = {
/*
	API URL = /api/list
	note: returns all the battles in JSON format with added parameter 'url' that will give front end the next path

*/
    listPlaces: function(req, res) {
        MongoClient.connect(config.db.url, function(err, db) {
            if (!err) {
                db.collection(config.db.collection).find({}).toArray((err, list) => {
                	// adding url key to each json so that next url is present for frontend
                    list = list.map(function(d) {
                        d.url = '/api/list/' + d._id;
                        return d;
                    });
                    res.send(output(err, list));
                    db.close();
                });
            } else {
                res.send(output(err));
            }
        });
    },

/*
	API URL : /api/list/:id
	example: /api/list/57caf23f6a05b3c9ca27733b
	note: this is specific to get single battle info

*/
    detailPlace: function(req, res) {
        var id = req.params.id || '';
        MongoClient.connect(config.db.url, function(err, db) {
            if (!err) {
                db.collection(config.db.collection).findOne({ _id: ObjectId(id) }, (err, list) => {
                    res.send(output(err, list));
                    db.close();
                });
            } else {
                res.send(output(err));
            }
        });
    },
/*
	API URL : /api/count
	Query : /api/count?year=300
	note: if parameters is passed it will give count according to the query else without paramters count of all battles will be returned
*/
    countPlaces: function(req, res) {
        var query = compileToInt(req.query);

        MongoClient.connect(config.db.url, function(err, db) {
            if (!err) {
                db.collection(config.db.collection).count(query, (err, count) => {
                    res.send(output(err, { count: count, query: query }));
                    db.close();
                });
            } else {
                res.send(output(err));
            }
        });
    },
/*
	API URL : /api/search
	Query : /api/search?year=300
	note: any parameters can be passed which are present in the data , else it will respond with error .
*/

    search: function(req, res) {
        var query = convertRegex(compileToInt(req.query)); // this function converts the string number to integer number
        
        if (Object.keys(query).length == 0) {
            res.send(output('no parameters sent'));
        } else
            MongoClient.connect(config.db.url, function(err, db) {
                if (!err) {
                    db.collection(config.db.collection).find({$or:query}).toArray((err, data) => {
                    	console.log(err);
                        if (data.length == 0) {
                            err = 'No match found';
                        }
                        res.send(output(err, data));
                        db.close();
                    });
                } else {
                    res.send(output(err));
                }
            });

    },
/*
	node: this is the function to generate stats as shown in the example
	API URL : /api/stats


*/
    statistics: function(req, res) {
        MongoClient.connect(config.db.url, function(err, db) {
            if (!err) {
            	// running tasks in parallel for faster result 
                async.parallel({
                    "battle_type": function(cb) {

                        db.collection(config.db.collection)
                            .aggregate([{ $group: { "_id": "$battle_type", "count": { $sum: 1 } } }])
                            .toArray((err, data) => {
                            	var finadata =[];
                                data.map(function(d) {
                                    d.name = d._id;
                                    if(d.name)
                                    	finadata.push(d.name);
                                   
                                });
                                cb(err, finadata);

                            });
                    },
                    "most_active": function(cb) {
                        db.collection(config.db.collection)
                            .find({}, { "attacker_king": 1, "defender_king": 1, "region": 1 })
                            .toArray((err, data) => {
                                var attacker_count = {};
                                var defender_count = {};
                                var region_count = {};
                                var finalObj = { attacker_king: "", defender_king: "", region: "" };
                                data.map(function(d) {
                                    if (!attacker_count[d.attacker_king]) {
                                        attacker_count[d.attacker_king] = 1;
                                    } else {
                                        attacker_count[d.attacker_king]++;
                                    }

                                    if (!defender_count[d.defender_king]) {
                                        defender_count[d.defender_king] = 1;
                                    } else {
                                        defender_count[d.defender_king]++;
                                    }

                                    if (!region_count[d.region]) {
                                        region_count[d.region] = 1;
                                    } else {
                                        region_count[d.region]++;
                                    }

                                });
                                

                                for (key in attacker_count) {
                                    if (!finalObj.attacker_king) {
                                        finalObj.attacker_king = key;
                                    } else if (attacker_count[finalObj.attacker_king] < attacker_count[key]) {
                                        finalObj.attacker_king = key;
                                    }
                                }

                                for (key in defender_count) {
                                    if (!finalObj.defender_king) {
                                        finalObj.defender_king = key;
                                    } else if (defender_count[finalObj.defender_king] < defender_count[key]) {
                                        finalObj.defender_king = key;
                                    }
                                }

                                for (key in region_count) {
                                    if (!finalObj.region) {
                                        finalObj.region = key;
                                    } else if (region_count[finalObj.region] < region_count[key]) {
                                        finalObj.region = key;
                                    }
                                }

                                cb(err, finalObj);

                            });
                    },
                    "attacker_outcome": function(cb) {
                        db.collection(config.db.collection)
                            .aggregate([{ $group: { "_id": "$attacker_outcome", "count": { $sum: 1 } } }])
                            .toArray((err, data) => {

                                var finalObj = {};
                                data.map(function(d) {
                                    
                                    if (d._id == '')
                                        d._id = 'draw';
                                    finalObj[d._id] = d.count;
                                })


                                cb(err, finalObj);

                            });
                    },
                    "attacker_size": function(cb) {
                        
                        db.collection(config.db.collection)
                            .aggregate([{ $match: { "attacker_size": { $type: 16 } } }, { $group: { "_id": null, "avg": { $avg: "$attacker_size" }, "min": { $min: "$attacker_size" }, "max": { $max: "$attacker_size" } } }])
                            .toArray((err, data) => {
                                
                                var finalObj = data[0];
                                delete finalObj._id;
                                cb(err, finalObj);

                            });
                    },
                    "defender_size": function(cb) {
                        
                        db.collection(config.db.collection)
                            .aggregate([{ $match: { "defender_size": { $type: 16 } } }, { $group: { "_id": null, "avg": { $avg: "$defender_size" }, "min": { $min: "$defender_size" }, "max": { $max: "$defender_size" } } }])
                            .toArray((err, data) => {
                                
                                var finalObj = data[0];
                                delete finalObj._id;
                                cb(err, finalObj);

                            });
                    }

                }, function(err, data) {
                    db.close();
                    res.send(output(err, data));
                });
            } else {
                res.send(output(err));
            }
        });
    }

}
