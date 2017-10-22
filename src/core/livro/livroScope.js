const validate = require('../../helpers/validate');

module.exports = {
    selecionar,
    selecionarPorId,
    inserir,
    atualizar,
    remover
};

async function selecionar(params) {
    const validation = {
        search: {
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}

async function selecionarPorId(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}

async function inserir(params) {
    const validation = {
        titulo: {
            required: true,
            string: true,
            maxLength: 255
        },
        idAutor: {
            required: true,
            string: true,
            maxLength: 200
        },
        idEditora: {
            string: true,
            maxLength: 200
        },
        sinopse: {
            string: true,
            maxLength: 500
        }
    };

    await validate(params, validation);
}

async function atualizar(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        },
        titulo: {
            required: true,
            string: true,
            maxLength: 255
        },
        idAutor: {
            required: true,
            string: true,
            maxLength: 200
        },
        idEditora: {
            string: true,
            maxLength: 200
        },
        sinopse: {
            string: true,
            maxLength: 500
        }
    };

    await validate(params, validation);
}

async function remover(params) {
    const validation = {
        id: {
            required: true,
            string: true,
            maxLength: 200
        }
    };

    await validate(params, validation);
}
