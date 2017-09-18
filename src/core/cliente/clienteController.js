const repository = require('./clienteRepository');
const scope = require('./clienteScope');

const colorize = require('../../helpers/colorize');

module.exports = {
    selecionar,
    selecionarPorId,
    atualizar
};

async function selecionar(req, res) {
    const params = {
        search: req.query.search,
        page: req.query.page,
        lines: req.query.lines || 10,
        order: req.query.order
    };

    if (params.order) {
        const orders = params.order.split(',');
        orders.forEach(order => {
            const orderOrientation = order.split('-');
            params['order' + capitalizeFirstLetter(orderOrientation[0])] = orderOrientation[1];
        });
    }

    try {
        await scope.selecionar(params);

        let data = await repository.selecionar(params);

        let lineCount = 0;

        data.forEach(item => {
            item.cor = colorize(item.cor);
            lineCount = item.lineCount;
            delete item.lineCount;
        });

        return res.finish({
            httpCode: 200,
            content: {
                data,
                lineCount
            }
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode | 500,
            error
        });
    }
}

async function selecionarPorId(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        await scope.selecionarPorId(params);

        let data = await repository.selecionarPorId(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Cliente não encontrado'
                }
            });
        }

        data = data[0];

        return res.finish({
            httpCode: 200,
            content: data
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode | 500,
            error
        });
    }
}

async function atualizar(req, res) {
    const params = {
        idUsuarioAcao: req.token.id,
        id: req.params.id,
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf,
        rg: req.body.rg,
        endereco: req.body.endereco,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        numero: req.body.numero,
        uf: req.body.uf,
        cidade: req.body.cidade,
        cep: req.body.cep
    };

    try {
        await scope.atualizar(params);

        await repository.atualizar(params);

        return res.finish({
            content: {
                message: 'Cliente alterado com sucesso'
            }
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode | 500,
            error
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
