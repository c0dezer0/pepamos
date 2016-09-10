var server = require('./server');
var config = require('./config');


server.listen(config.port, () => {
    console.log('Magic happening on address : ' + config.host + ':' + config.port);
});
