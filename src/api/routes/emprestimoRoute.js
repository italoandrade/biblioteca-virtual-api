module.exports = (app) => {
    const emprestimo = require('../../core/emprestimo/emprestimoController');

    app.route('/historico-emprestimo').get(global.asyncWrap(emprestimo.selecionarHistorico));
};
