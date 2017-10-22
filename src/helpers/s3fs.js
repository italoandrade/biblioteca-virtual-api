const s3fs = require('../infra/aws');

module.exports = {
    upload
};

async function upload(dir, fileName, base64) {
    return new Promise((resolve, reject) => {
        s3fs.writeFile('./' + dir + '/' + fileName, new Buffer(base64, "base64"), {
            ACL: 'public-read'
        }, function (err) {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    })
}