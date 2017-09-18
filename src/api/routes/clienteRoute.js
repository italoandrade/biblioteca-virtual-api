module.exports = (app) => {
    const cliente = require('../../core/cliente/clienteController');

    app.route('/cliente').get(global.asyncWrap(cliente.selecionar, {internal: true}));
    app.route('/cliente/:id').get(global.asyncWrap(cliente.selecionarPorId, {internal: true}));
    app.route('/cliente/:id').put(global.asyncWrap(cliente.atualizar, {internal: true}));
};
