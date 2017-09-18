module.exports = (app) => {
    const editora = require('../../core/editora/editoraController');

    app.route('/editora').get(global.asyncWrap(editora.selecionar, {internal: true}));
    app.route('/editora/:id').get(global.asyncWrap(editora.selecionarPorId, {internal: true}));
    app.route('/editora').post(global.asyncWrap(editora.inserir, {internal: true}));
    app.route('/editora/:id').put(global.asyncWrap(editora.atualizar, {internal: true}));
    app.route('/editora/:id').delete(global.asyncWrap(editora.remover, {internal: true}));
};
