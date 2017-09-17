module.exports = (app) => {
    const typeClient = require('../../core/typeClient/typeClientController');

    app.route('/type-client').get(global.asyncWrap(typeClient.select, {public: true}));
};
