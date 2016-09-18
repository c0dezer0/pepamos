const controller = require('./controller');

function initData(app) {

    app.post('/api/restro', controller.register);
    // app.put()
    app.get('/api/restro/:id', controller.detail);
}

module.exports = initData
