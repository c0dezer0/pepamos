module.exports = {
    "db": {
        "url": "mongodb://admin:admin@ds021346.mlab.com:21346/pepamose",
        "collection": "battles"
    },
    "port": process.env.PORT || '9000',
    "env": process.env.NODE_ENV || "development",
    "host": "localhost"
}
