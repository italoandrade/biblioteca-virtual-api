module.exports = (app) => {
    const usuario = require('../../core/usuario/usuarioController');

    app.route('/usuario/login').post(global.asyncWrap(usuario.login, {public: true}));
    app.route('/usuario/relogin').get(global.asyncWrap(usuario.relogin));
    app.route('/usuario/signup').post(global.asyncWrap(usuario.signup, {public: true}));
    // app.route('/user/resend-confirmation').get(global.asyncWrap(user.resendConfirmation));
    // app.route('/user/confirm-email').post(global.asyncWrap(user.confirmEmail, {public: true}));
    // app.route('/user/recover').post(global.asyncWrap(user.recoverPassword, {public: true}));
    // app.route('/user/recover/confirm').post(global.asyncWrap(user.recoverPasswordConfirm, {public: true}));
    //
    // app.route('/user/notification').post(global.asyncWrap(user.selectNotification));
    // app.route('/user/notification/recheck').get(global.asyncWrap(user.recheckNotification));
    // app.route('/user/notification/mark-all-read').put(global.asyncWrap(user.notificationMarkAllRead));
    // app.route('/user/notification/:id/dismiss').put(global.asyncWrap(user.notificationDismiss));
    // app.route('/user/notification/:id/restore').put(global.asyncWrap(user.notificationRestore));
    // app.route('/user/notification/:id/mark-open').put(global.asyncWrap(user.notificationMarkOpen));
    //
    // app.route('/user/tvshow').post(global.asyncWrap(user.selectTvshow));
    // app.route('/user/tvshow/episode/:id/mark-as-watched').post(global.asyncWrap(user.markEpisodeAsWatched));
};
