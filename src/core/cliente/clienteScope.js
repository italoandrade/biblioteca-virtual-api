const validate = require('../../helpers/validate');

module.exports = {
    selecionar,
    selecionarPorId,
    atualizar
};

async function selecionar(params) {
    const validation = {
        search: {
            string: true,
            maxLength: 200
        }
    };

    try {
        await validate(params, validation);
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function selecionarPorId(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        }
    };

    try {
        await validate(params, validation);
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function atualizar(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        },
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
        cpf: {
            required: true,
            string: true,
            maxLength: 11
        },
        rg: {
            string: true,
            maxLength: 15
        },
        endereco: {
            required: true,
            string: true,
            maxLength: 255
        },
        complemento: {
            string: true,
            maxLength: 100
        },
        bairro: {
            required: true,
            string: true,
            maxLength: 100
        },
        numero: {
            string: true,
            maxLength: 20
        },
        uf: {
            required: true,
            string: true,
            maxLength: 2
        },
        cidade: {
            required: true,
            string: true,
            maxLength: 100
        },
        cep: {
            required: true,
            string: true,
            maxLength: 8
        }
    };

    try {
        await validate(params, validation);
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}
