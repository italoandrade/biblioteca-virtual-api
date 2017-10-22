const db = global.db;

module.exports = {
    selecionarHistorico
};

async function selecionarHistorico(params) {
    return db.func('Biblioteca.SelecionarHistoricoEmprestimoLivro', [
        params.search,
        params.page,
        params.lines,
        params.orderLivro,
        params.orderDataEmprestimo,
        params.orderDataDevolucao,
        params.orderStatus
    ]);
}
