const s3fs = require('../../helpers/s3fs');
const md5 = require('md5');
const repository = require('./livroRepository');

module.exports = {
    uploadImagem
};

async function uploadImagem(params) {
    let image = params.novaImagem;

    if (image.indexOf(';base64,') === -1) {
        throw {
            code: 1,
            message: 'Imagem inválida',
            httpCode: 400
        }
    }

    image = image.substr(5);

    image = image.split(';base64,');

    const extension = image[0].match(/(jpg|jpeg|png|gif)$/);
    let fileName = md5(params.id + new Date().toISOString());

    if (!extension) {
        throw {
            httpCode: 415,
            code: 2,
            message: 'Mimetype inválido'
        }
    } else {
        fileName = fileName + '.' + extension[0];
    }

    try {
        await s3fs.upload('livro', fileName, image[1]);

        params.fileName = fileName;
    } catch (e) {
        console.log(e);
        throw {
            httpCode: 409,
            code: 3,
            message: 'Não foi possível fazer o upload do arquivo'
        }
    }

    await repository.uploadImagem(params);
}
