module.exports = (app) => {
    const livro = require('../../core/livro/livroController');

    app.route('/livro').get(global.asyncWrap(livro.selecionar, {internal: true}));
    app.route('/livro/:id').get(global.asyncWrap(livro.selecionarPorId, {public: true}));
    app.route('/livro').post(global.asyncWrap(livro.inserir, {internal: true}));
    app.route('/livro/:id').put(global.asyncWrap(livro.atualizar, {internal: true}));
    app.route('/livro/:id').delete(global.asyncWrap(livro.remover, {internal: true}));
};
