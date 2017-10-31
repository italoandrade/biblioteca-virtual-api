module.exports = (app) => {
    const emprestimo = require('../../core/emprestimo/emprestimoController');

    app.route('/emprestimo').get(global.asyncWrap(emprestimo.selecionar));
    app.route('/historico-emprestimo').get(global.asyncWrap(emprestimo.selecionarPorUsuario));
    app.route('/emprestimo-usuario/:id/cancelar-reserva').put(global.asyncWrap(emprestimo.cancelarReservaUsuario));
    app.route('/emprestimo/:id/cancelar-reserva').put(global.asyncWrap(emprestimo.cancelarReserva, {internal: true}));
    app.route('/emprestimo/:id/marcar-emprestado').put(global.asyncWrap(emprestimo.marcarEmprestado, {internal: true}));
    app.route('/emprestimo/:id/marcar-devolvido').put(global.asyncWrap(emprestimo.marcarDevolvido, {internal: true}));
};
