module.exports = (app) => {
    const catalogo = require('../../core/catalogo/catalogoController');

    app.route('/selecionar-catalogo').post(global.asyncWrap(catalogo.selecionar, {public: true}));
    app.route('/catalogo/livro/:id/efetuar-emprestimo').post(global.asyncWrap(catalogo.efetuarEmprestimo));
};
