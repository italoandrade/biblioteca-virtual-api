const db = global.db;

module.exports = {
    selecionar,
    selecionarPorId,
    atualizar
};

async function selecionar(params) {
    return db.func('Biblioteca.SelecionarCliente', [
        params.search,
        params.page,
        params.lines,
        params.orderNome,
        params.orderCpf,
        params.orderEmail
    ]);
}

async function selecionarPorId(params) {
    return db.func('Biblioteca.SelecionarClientePorId', [
        params.id
    ]);
}

async function atualizar(params) {
    let error;

    let data = db.json('Biblioteca.AtualizarCliente', [
        params.idUsuarioAcao,
        params.id,
        params.nome,
        params.email,
        params.cpf,
        params.rg,
        params.endereco,
        params.complemento,
        params.bairro,
        params.numero,
        params.uf,
        params.cidade,
        params.cep
    ]);

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 404;
            break;
        case 2:
            error = data;
            error.httpCode = 409;
            break;
    }

    if (error) {
        throw error;
    } else {
        return data;
    }
}
