const db = global.db;

module.exports = {
    selecionar,
    efetuarReserva
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

async function efetuarReserva(params) {
    return db.json('Biblioteca.EfetuarReservaLivro', [
        params.idUsuario,
        params.id
    ]);
}

