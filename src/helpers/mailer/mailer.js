const nodemailer = require('nodemailer');
const fs = require("fs");

let emailTemplate;

module.exports = sendMail;

const transporter = nodemailer.createTransport({
    host: 'mail.trackfy.com',
    port: 587,
    secure: false,
    auth: {
        user: 'no-reply@trackfy.com',
        pass: 'Jbge25J#4r<6r>'
    },
    tls: {
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: '"Trackfy" <no-reply@trackfy.com>'
};

transporter.verify((error) => {
    if (error) console.log(error);
});

async function sendMail(mailOptionsExtend) {
    Object.assign(mailOptions, mailOptionsExtend);

    mailOptions.html = emailTemplate;

    Object.keys(mailOptions.data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');

        mailOptions.html = mailOptions.html.replace(regex, mailOptions.data[key]);
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);

                return reject(error);
            }

            resolve(info);
        });
    });
}

fs.readFile('./src/helpers/mailer/template.html', (err, data) => {
    if (err) return console.log(err);

    emailTemplate = data.toString();
});

