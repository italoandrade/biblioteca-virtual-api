const db = global.db;

module.exports = {
    selecionar,
    selecionarSimples,
    selecionarPorId,
    inserir,
    atualizar,
    remover
};

async function selecionar(params) {
    return db.func('Biblioteca.SelecionarAutor', [
        params.search,
        params.page,
        params.lines,
        params.orderNome
    ]);
}

async function selecionarSimples() {
    return db.func('Biblioteca.SelecionarAutorSimples');
}

async function selecionarPorId(params) {
    return db.func('Biblioteca.SelecionarAutorPorId', [
        params.id
    ]);
}

async function inserir(params) {
    return db.json('Biblioteca.InserirAutor', [
        params.idUsuario,
        params.nome
    ]);
}

async function atualizar(params) {
    return db.json('Biblioteca.AtualizarAutor', [
        params.idUsuario,
        params.id,
        params.nome
    ]);
}

async function remover(params) {
    return db.json('Biblioteca.RemoverAutor', [
        params.id
    ]);
}
