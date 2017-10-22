const S3FS = require('s3fs');

const s3fsImpl = new S3FS('biblioteca-virtual', {
    accessKeyId: global.config.aws.accessKeyId,
    secretAccessKey: global.config.aws.secretAccessKey
});

module.exports = s3fsImpl;