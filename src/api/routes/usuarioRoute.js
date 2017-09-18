module.exports = (app) => {
    const usuario = require('../../core/usuario/usuarioController');

    app.route('/usuario/login').post(global.asyncWrap(usuario.login, {public: true}));
    app.route('/usuario/relogin').get(global.asyncWrap(usuario.relogin));
    app.route('/usuario/cadastrar').post(global.asyncWrap(usuario.cadastrar, {public: true}));
};
