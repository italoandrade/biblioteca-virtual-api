const validate = require('../../helpers/validate');

module.exports = {
    login,
    cadastrar
};

async function login(params) {
    const validation = {
        email: {
            required: true,
            string: true,
            maxLength: 255
        },
        senha: {
            required: true,
            string: true,
            maxLength: 40
        }
    };

    try {
        await validate(params, validation);
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function cadastrar(params) {
    const validation = {
        nome: {
            required: true,
            string: true,
            maxLength: 100
        },
        email: {
            required: true,
            string: true,
            maxLength: 255
        },
        senha: {
            required: true,
            string: true,
            maxLength: 40
        },
        confirmarSenha: {
            required: true,
            string: true,
            maxLength: 40
        }
    };

    try {
        await validate(params, validation);

        if (params.senha !== params.confirmarSenha) {
            throw ['Confirmação de senha não confere']
        }
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}
