const db = global.db;

module.exports = {
    selecionar,
    efetuarEmprestimo
};

async function selecionar(params) {
    return db.func('Biblioteca.SelecionarCatalogo', [
        params.s3bucket,
        params.search,
        params.idAutor,
        params.idEditora,
        params.unless
    ]);
}

async function efetuarEmprestimo(params) {
    return db.json('Biblioteca.EfetuarEmprestimoLivro', [
        params.idUsuario,
        params.id
    ]);
}

