const db = global.db;

module.exports = {
    selecionar,
    selecionarPorId,
    inserir,
    atualizar,
    remover
};

async function selecionar(params) {
    return db.func('Biblioteca.SelecionarEditora', [
        params.search,
        params.page,
        params.lines,
        params.orderNome
    ]);
}

async function selecionarPorId(params) {
    return db.func('Biblioteca.SelecionarEditoraPorId', [
        params.id
    ]);
}

async function inserir(params) {
    return db.json('Biblioteca.InserirEditora', [
        params.idUsuario,
        params.nome
    ]);
}

async function atualizar(params) {
    return db.json('Biblioteca.AtualizarEditora', [
        params.idUsuario,
        params.id,
        params.nome
    ]);
}

async function remover(params) {
    return db.json('Biblioteca.RemoverEditora', [
        params.id
    ]);
}
