const repository = require('./emprestimoRepository');
const scope = require('./emprestimoScope');

module.exports = {
    selecionar,
    selecionarPorUsuario,
    cancelarReservaUsuario,
    cancelarReserva,
    marcarEmprestado,
    marcarDevolvido
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

async function selecionarPorUsuario(req, res) {
    const params = {
        idUsuario: req.token.id,
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

async function cancelarReservaUsuario(req, res) {
    const params = {
        idUsuario: req.token.id,
        id: req.params.id
    };

    try {
        let data = await repository.cancelarReserva(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            default:
                content = {
                    message: 'Reserva cancelada com sucesso'
                };
        }

        return res.finish({
            httpCode,
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

async function cancelarReserva(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        let data = await repository.cancelarReserva(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            default:
                content = {
                    message: 'Reserva cancelada com sucesso'
                };
        }

        return res.finish({
            httpCode,
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

async function marcarEmprestado(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        let data = await repository.marcarEmprestado(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            default:
                content = {
                    message: 'Empréstimo marcado como emprestado com sucesso'
                };
        }

        return res.finish({
            httpCode,
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

async function marcarDevolvido(req, res) {
    const params = {
        id: req.params.id
    };

    try {
        let data = await repository.marcarDevolvido(params);

        let httpCode = 200;
        let error;
        let content;

        switch (data.executionCode) {
            case 1:
                httpCode = 404;
                error = data;
                break;
            default:
                content = {
                    message: 'Empréstimo marcado como devolvido com sucesso'
                };
        }

        return res.finish({
            httpCode,
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
