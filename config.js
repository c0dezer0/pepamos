module.exports = {
    "db": {
        "url": "mongodb://heroku:heroku@ds147995.mlab.com:47995/toppr-got",
        "collection": "battles"
    },
    "port": process.env.PORT || '9000',
    "env": process.env.NODE_ENV || "development",
    "host": "localhost"
}
