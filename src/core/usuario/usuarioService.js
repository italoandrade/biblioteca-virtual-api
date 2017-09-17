const crypto = require('../../helpers/crypto');
const mailer = require('../../helpers/mailer/mailer');
const repository = require('./usuarioRepository');

module.exports = {
    login,
    relogin: login,
    // signup,
    // resendConfirmation,
    // confirmEmail,
    // recoverPassword,
    // recoverPasswordConfirm,
    // recoverPasswordConfirm2
};

async function login(data) {
    delete data.senhaCorreta;
    data.token = crypto.encrypt(data.token);

    return data;
}

// function signup(user) {
//     let emailToken = crypto.encrypt({
//         emailConfirmation: true,
//         userId: user.id
//     });
//
//     mailer({
//         subject: 'Obrigado por se juntar ao Trackfy',
//         to: user.email,
//         text: `Olá ${user.fullname}, você já pode utilizar o site, mas para ficar por dentro das novidades confirme seu e-mail acessando: https://www.trackfy.com${user.url}`,
//         data: {
//             name: user.fullname,
//             title: 'Obrigado por se juntar ao Trackfy',
//             message: `Olá ${user.fullname}, você já pode utilizar o site, mas para ficar por dentro das novidades confirme seu e-mail clicando no botão
// abaixo.<br><br>Ou acesse o seguinte link caso o botão esteja indisponível: https://www.trackfy.com/?emailConfirmation=${emailToken}`,
//             buttonText: 'Confirmar e-mail',
//             buttonUrl: `https://www.trackfy.com/?emailConfirmation=${emailToken}`
//         }
//     });
// }

// async function resendConfirmation(params) {
//     let user = await repository.relogin(params);
//
//     user = user[0];
//
//     let emailToken = crypto.encrypt({
//         emailConfirmation: true,
//         userId: user.id
//     });
//
//     mailer({
//         subject: 'Obrigado por se juntar ao Trackfy - Confirme seu e-mail',
//         to: user.email,
//         text: `Olá ${user.fullname}, você já pode utilizar o site, mas para ficar por dentro das novidades confirme seu e-mail acessando: https://www.trackfy.com${emailToken}`,
//         data: {
//             name: user.fullname,
//             title: 'Obrigado por se juntar ao Trackfy',
//             message: `Olá ${user.fullname}, você já pode utilizar o site, mas para ficar por dentro das novidades confirme seu e-mail clicando no botão
// abaixo.<br><br>Ou acesse o seguinte link caso o botão esteja indisponível: https://www.trackfy.com/?emailConfirmation=${emailToken}`,
//             buttonText: 'Confirmar e-mail',
//             buttonUrl: `https://www.trackfy.com/?emailConfirmation=${emailToken}`
//         }
//     });
// }
//
// async function confirmEmail(params) {
//     let emailToken = crypto.decrypt(params.emailConfirmation);
//
//     return emailToken.userId;
// }
//
// async function recoverPassword(user) {
//     let passwordToken = crypto.encrypt({
//         passwordRecover: true,
//         userId: user.id,
//         timelife: new Date().setDate(new Date().getDate() + 1)
//     });
//
//     let recoverToken = {
//         email: user.email,
//         token: passwordToken
//     };
//
//     recoverToken = new Buffer(JSON.stringify(recoverToken)).toString('base64');
//
//     mailer({
//         subject: 'Recuperar conta',
//         to: user.email,
//         text: `Olá ${user.fullname}, acabamos de receber um pedido de recuperação de conta. Para trocar sua senha, acesse: https://www.trackfy.com/recover/${recoverToken}`,
//         data: {
//             name: user.fullname,
//             title: 'Recuperar conta',
//             message: `Olá ${user.fullname}, acabamos de receber um pedido de recuperação de senha. Para trocar sua senha clique no botão
// abaixo.<br><br>Ou acesse o seguinte link caso o botão esteja indisponível: https://www.trackfy.com/recover/${recoverToken}`,
//             buttonText: 'Recuperar conta',
//             buttonUrl: `https://www.trackfy.com/recover/${recoverToken}`
//         }
//     });
// }
//
// async function recoverPasswordConfirm(params) {
//     return crypto.decrypt(params.token);
// }
//
// async function recoverPasswordConfirm2(params) {
//     let user = await repository.relogin(params);
//
//     user = user[0];
//
//     delete user.correctPassword;
//     user.token = crypto.encrypt(user.token);
//
//     mailer({
//         subject: 'Senha alterada com sucesso',
//         to: user.email,
//         text: `Olá ${user.fullname}, sua senha foi alterada com sucesso. Se você não pediu para trocar sua senha, entre em contato conosco pelo endereço: contato@trackfy.com`,
//         data: {
//             name: user.fullname,
//             title: 'Senha alterada com sucesso',
//             message: `Olá ${user.fullname}, sua senha foi alterada com sucesso.<br><br>Se você não pediu para trocar sua senha, entre em contato conosco pelo endereço: contato@trackfy.com`,
//             buttonText: 'Acessar',
//             buttonUrl: `https://www.trackfy.com/`
//         }
//     });
//
//     return user;
// }
