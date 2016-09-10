const controller = require('./controller');

function initData(app) {

    app.get('/api/list', controller.listPlaces);

    app.get('/api/list/:id', controller.detailPlace);

    app.get('/api/count', controller.countPlaces);

    app.get('/api/search', controller.search);

    app.get('/api/stats', controller.statistics);
}

module.exports = initData
