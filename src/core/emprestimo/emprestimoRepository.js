const db = global.db;

module.exports = {
    selecionar,
    cancelarReserva,
    marcarEmprestado,
    marcarDevolvido
};

async function selecionar(params) {
    return db.func('Biblioteca.SelecionarHistoricoEmprestimoLivro', [
        params.idUsuario,
        params.search,
        params.page,
        params.lines,
        params.orderLivro,
        params.orderCliente,
        params.orderDataReserva,
        params.orderDataEmprestimo,
        params.orderDataDevolucao,
        params.orderStatus
    ]);
}

async function cancelarReserva(params) {
    return db.json('Biblioteca.CancelarReservaLivro', [
        params.idUsuario,
        params.id
    ]);
}

async function marcarEmprestado(params) {
    return db.json('Biblioteca.MarcarEmprestadoLivro', [
        params.id
    ]);
}

async function marcarDevolvido(params) {
    return db.json('Biblioteca.MarcarDevolvidoLivro', [
        params.id
    ]);
}
