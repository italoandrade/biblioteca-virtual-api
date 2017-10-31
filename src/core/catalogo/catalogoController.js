const repository = require('./catalogoRepository');
const scope = require('./catalogoScope');

module.exports = {
    selecionar,
    efetuarReserva
};

async function selecionar(req, res) {
    const params = {
        s3bucket: global.config.aws.s3bucket,
        search: req.body.search,
        idAutor: req.body.idAutor,
        idEditora: req.body.idEditora,
        unless: req.body.unless && req.body.unless.length ? req.body.unless : null
    };

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

async function efetuarReserva(req, res) {
    const params = {
        idUsuario: req.token.id,
        id: req.params.id
    };

    try {
        let data = await repository.efetuarReserva(params);

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
                    message: 'Reserva efetuada com sucesso'
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