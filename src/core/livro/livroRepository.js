const db = global.db;

module.exports = {
    selecionar,
    selecionarPorId,
    inserir,
    atualizar,
    uploadImagem,
    remover
};

async function selecionar(params) {
    return db.func('Biblioteca.SelecionarLivro', [
        params.search,
        params.page,
        params.lines,
        params.orderTitulo,
        params.orderNomeAutor,
        params.orderNomeEditora,
        params.orderEstoque
    ]);
}

async function selecionarPorId(params) {
    return db.func('Biblioteca.SelecionarLivroPorId', [
        params.s3bucket,
        params.id
    ]);
}

async function inserir(params) {
    return db.json('Biblioteca.InserirLivro', [
        params.idUsuario,
        params.imagem,
        params.titulo,
        params.idAutor,
        params.idEditora,
        params.sinopse,
        params.estoque
    ]);
}

async function atualizar(params) {
    return db.json('Biblioteca.AtualizarLivro', [
        params.idUsuario,
        params.id,
        params.imagem,
        params.titulo,
        params.idAutor,
        params.idEditora,
        params.sinopse,
        params.estoque
    ]);
}

async function uploadImagem(params) {
    return db.json('Biblioteca.UploadImagemLivro', [
        params.id,
        params.fileName
    ]);
}

async function remover(params) {
    return db.json('Biblioteca.RemoverLivro', [
        params.id
    ]);
}
