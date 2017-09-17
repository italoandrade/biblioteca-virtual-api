module.exports = (app) => {
    const region = require('../../core/region/regionController');

    app.route('/region').get(global.asyncWrap(region.select, {public: true}));
};
