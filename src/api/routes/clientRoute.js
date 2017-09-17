module.exports = (app) => {
    const client = require('../../core/client/clientController');

    app.route('/client').get(global.asyncWrap(client.select));
    app.route('/client/:id').get(global.asyncWrap(client.selectById));
    app.route('/client').post(global.asyncWrap(client.insert));
    app.route('/client/:id').put(global.asyncWrap(client.update));
    app.route('/client/:id').delete(global.asyncWrap(client.deletee));
};
