module.exports = (app) => {
    const autor = require('../../core/autor/autorController');

    app.route('/autor').get(global.asyncWrap(autor.selecionar, {internal: true}));
    app.route('/autor-simples').get(global.asyncWrap(autor.selecionarSimples, {public: true}));
    app.route('/autor/:id').get(global.asyncWrap(autor.selecionarPorId, {internal: true}));
    app.route('/autor').post(global.asyncWrap(autor.inserir, {internal: true}));
    app.route('/autor/:id').put(global.asyncWrap(autor.atualizar, {internal: true}));
    app.route('/autor/:id').delete(global.asyncWrap(autor.remover, {internal: true}));
};
