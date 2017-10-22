const validate = require('../../helpers/validate');

module.exports = {
    selecionar
};

async function selecionar(params) {
    const validation = {
        search: {
            string: true,
            maxLength: 255
        },
        idAutor: {
            string: true,
            maxLength: 200
        },
        idEditora: {
            string: true,
            maxLength: 200
        },
        unless: {
            array: {
                string: true
            }
        }
    };

    await validate(params, validation);
}