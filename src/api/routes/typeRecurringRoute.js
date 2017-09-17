module.exports = (app) => {
    const typeRecurring = require('../../core/typeRecurring/typeRecurringController');

    app.route('/type-recurring').get(global.asyncWrap(typeRecurring.select, {public: true}));
};
