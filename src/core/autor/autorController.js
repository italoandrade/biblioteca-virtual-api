const repository = require('./autorRepository');
const scope = require('./autorScope');

module.exports = {
    selecionar,
    selecionarSimples,
    selecionarPorId,
    inserir,
    atualizar,
    remover
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
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.selecionar(params);

        let lineCount = 0;

        data.forEach(item => {
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
            httpCode: 500,
            error
        });
    }
}

async function selecionarSimples(req, res) {
    try {
        let data = await repository.selecionarSimples();

        return res.finish({
            httpCode: 200,
            content: {
                data
            }
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
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
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.selecionarPorId(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Autor não encontrado'
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
            httpCode: 500,
            error
        });
    }
}

async function inserir(req, res) {
    const params = {
        idUsuario: req.token.id,
        nome: req.body.nome
    };

    try {
        await scope.inserir(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.inserir(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 409;
                error = data;
                break;
            default:
                content = data.content;
        }

        return res.finish({
            httpCode: httpCode,
            error,
            content
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}

async function atualizar(req, res) {
    const params = {
        idUsuario: req.token.id,
        id: req.params.id,
        nome: req.body.nome
    };

    try {
        await scope.atualizar(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.atualizar(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            case 2:
                httpCode = 409;
                error = data;
                break;
            default:
                content = {
                    message: 'Autor alterado com sucesso'
                };
        }

        return res.finish({
            httpCode: httpCode,
            error,
            content
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}

async function remover(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        await scope.remover(params);
    } catch (err) {
        return res.finish({
            httpCode: 400,
            error: err
        });
    }

    try {
        let data = await repository.remover(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            case 2:
                httpCode = 404;
                error = data;
                break;
            default:
                content = {
                    message: 'Autor excluído com sucesso'
                };
        }

        return res.finish({
            httpCode: httpCode,
            error,
            content
        });
    } catch (error) {
        return res.finish({
            httpCode: 500,
            error
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
