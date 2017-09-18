const db = global.db;

module.exports = {
    login,
    relogin,
    cadastrar
};

async function login(params) {
    return db.func('Biblioteca.UsuarioLogin', [
        null,
        params.email,
        params.senha
    ]);
}

async function relogin(params) {
    return db.func('Biblioteca.UsuarioLogin', [
        params.userId,
        null,
        null
    ]);
}

async function cadastrar(params) {
    let error;

    let data = db.json('Biblioteca.UsuarioCadastrar', [
        params.nome,
        params.email,
        params.senha
    ]);

    switch (data.executionCode) {
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
