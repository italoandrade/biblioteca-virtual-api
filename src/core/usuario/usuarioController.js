const repository = require('./usuarioRepository');
const scope = require('./usuarioScope');
const service = require('./usuarioService');

const colorize = require('../../helpers/colorize');

module.exports = {
    login,
    relogin,
    cadastrar
};

async function login(req, res) {
    const params = {
        email: req.body.email,
        senha: req.body.senha
    };

    try {
        await scope.login(params);

        let data = await repository.login(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Usuário não encontrado'
                }
            });
        }

        data = data[0];

        data.cor = colorize(data.cor);

        if (!data.senhaCorreta) {
            return res.finish({
                httpCode: 401,
                error: {
                    executionCode: 2,
                    message: 'Senha incorreta'
                }
            });
        }

        data = await service.login(data);

        return res.finish({
            httpCode: 200,
            content: data
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function relogin(req, res) {
    const params = {
        userId: req.token.id
    };

    try {
        let data = await repository.relogin(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Usuário não encontrado'
                }
            });
        }

        data = data[0];

        data.cor = colorize(data.cor);

        data = await service.relogin(data);

        return res.finish({
            content: data
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function cadastrar(req, res) {
    const params = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        confirmarSenha: req.body.confirmarSenha
    };

    try {
        await scope.cadastrar(params);

        await repository.cadastrar(params);

        let usuario = await repository.login(params);
        usuario = usuario[0];
        usuario.cor = colorize(usuario.cor);
        usuario = await service.login(usuario);

        return res.finish({
            content: usuario
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}
