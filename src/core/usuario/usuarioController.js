const repository = require('./usuarioRepository');
const scope = require('./usuarioScope');
const service = require('./usuarioService');

const colorize = require('../../helpers/colorize');

module.exports = {
    login,
    relogin,
    signup,
    // resendConfirmation,
    // confirmEmail,
    // recoverPassword,
    // recoverPasswordConfirm,
    //
    // selectNotification,
    // recheckNotification,
    // notificationMarkAllRead,
    // notificationDismiss,
    // notificationRestore,
    // notificationMarkOpen,
    //
    // selectTvshow,
    // markEpisodeAsWatched
};

async function login(req, res) {
    const params = {
        email: req.body.email,
        senha: req.body.senha
    };

    try {
        await scope.login(params);

        let data = await repository.login(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Usuário não encontrado'
                }
            });
        }

        data = data[0];

        data.cor = colorize(data.cor);

        if (!data.senhaCorreta) {
            return res.finish({
                httpCode: 401,
                error: {
                    executionCode: 2,
                    message: 'Senha incorreta'
                }
            });
        }

        data = await service.login(data);

        return res.finish({
            httpCode: 200,
            content: data
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function relogin(req, res) {
    const params = {
        userId: req.token.id
    };

    try {
        let data = await repository.relogin(params);

        if (!data.length) {
            return res.finish({
                httpCode: 404,
                error: {
                    executionCode: 1,
                    message: 'Usuário não encontrado'
                }
            });
        }

        data = data[0];

        data.cor = colorize(data.cor);

        data = await service.relogin(data);

        return res.finish({
            content: data
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function signup(req, res) {
    const params = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        confirmarSenha: req.body.confirmarSenha
    };

    try {
        await scope.signup(params);

        await repository.signup(params);

        let usuario = await repository.login(params);
        usuario = usuario[0];
        usuario.cor = colorize(usuario.cor);
        usuario = await service.login(usuario);

        return res.finish({
            content: usuario
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

// async function resendConfirmation(req, res) {
//     const params = {
//         userId: req.token.id,
//         emailConfirmation: req.body.emailConfirmation
//     };
//
//     try {
//         await service.resendConfirmation(params);
//
//         return res.finish({
//             httpCode: 200
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function confirmEmail(req, res) {
//     const params = {
//         emailConfirmation: req.body.emailConfirmation
//     };
//
//     try {
//         params.userId = await service.confirmEmail(params);
//
//         if (params.userId) {
//             let data = await repository.confirmEmail(params.userId);
//
//             params.userId = data.content.userId;
//
//             let httpCode = 200;
//             let error;
//             let user;
//
//             switch (data.executionCode) {
//                 case 1:
//                     httpCode = 409;
//                     error = data;
//                     break;
//                 default:
//                     user = await repository.relogin(params);
//                     user = user[0];
//                     user = await service.relogin(user);
//             }
//
//             return res.finish({
//                 httpCode: httpCode,
//                 error,
//                 content: user
//             });
//         } else {
//             return res.finish({
//                 httpCode: 409,
//                 error: {
//                     executionCode: 3,
//                     message: 'Token de confirmação de e-mail inválido'
//                 }
//             });
//         }
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function recoverPassword(req, res) {
//     const params = {
//         email: req.body.email
//     };
//
//     try {
//         await scope.recoverPassword(params);
//     } catch (err) {
//         return res.finish({
//             httpCode: 400,
//             error: err
//         });
//     }
//
//     try {
//         let user = await repository.recoverPassword(params);
//
//         if (!user.length) {
//             return res.finish({
//                 httpCode: 404,
//                 error: {
//                     executionCode: 1,
//                     message: 'Usuário não encontrado'
//                 }
//             });
//         }
//
//         user = user[0];
//
//         await service.recoverPassword(user);
//
//         return res.finish({
//             httpCode: 200,
//             content: {
//                 message: 'E-mail de recuperação de conta enviado com sucesso'
//             }
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function recoverPasswordConfirm(req, res) {
//     const params = {
//         token: req.body.token,
//         password: req.body.password,
//         confirmPassword: req.body.confirmPassword
//     };
//
//     try {
//         await scope.recoverPasswordConfirm(params);
//     } catch (err) {
//         return res.finish({
//             httpCode: 400,
//             error: err
//         });
//     }
//
//     if (params.password !== params.confirmPassword) {
//         return res.finish({
//             httpCode: 409,
//             error: {
//                 executionCode: 1,
//                 message: 'Confirmação de senha não confere'
//             }
//         });
//     }
//
//     try {
//         let token = await service.recoverPasswordConfirm(params);
//
//         if (token.timelife < new Date()) {
//             return res.finish({
//                 httpCode: 409,
//                 error: {
//                     executionCode: 2,
//                     message: 'Seu token de recuperação de conta expirou'
//                 }
//             });
//         }
//
//         params.userId = token.userId;
//
//         let data = await repository.recoverPasswordConfirm(params);
//
//         params.userId = data.content.userId;
//
//         let user = await service.recoverPasswordConfirm2(params);
//
//         user.color = colorize(user.color);
//
//         return res.finish({
//             httpCode: 200,
//             content: user
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function selectNotification(req, res) {
//     const params = {
//         userId: req.token.id,
//         unless: req.body.unless && req.body.unless.length ? req.body.unless : null
//     };
//
//     try {
//         let data = await repository.selectNotification(params);
//
//         return res.finish({
//             httpCode: 200,
//             content: data
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function recheckNotification(req, res) {
//     const params = {
//         userId: req.token.id
//     };
//
//     try {
//         let data = await repository.recheckNotification(params);
//
//         data = data[0];
//
//         return res.finish({
//             httpCode: 200,
//             content: data
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function notificationMarkAllRead(req, res) {
//     const params = {
//         userId: req.token.id
//     };
//
//     try {
//         await repository.notificationMarkAllRead(params);
//
//         return res.finish({
//             httpCode: 200,
//             content: {
//                 message: 'Todas notificações foram marcadas como lidas'
//             }
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function notificationDismiss(req, res) {
//     const params = {
//         userId: req.token.id,
//         id: req.params.id
//     };
//
//     try {
//         let data = await repository.notificationDismiss(params);
//
//         let httpCode = 200;
//         let error;
//         let content;
//
//         switch (data.executionCode) {
//             case 1:
//                 httpCode = 404;
//                 error = data;
//                 break;
//             default:
//                 content = {
//                     message: 'Notificação dispensada com sucesso'
//                 }
//         }
//
//         return res.finish({
//             httpCode: httpCode,
//             error,
//             content
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function notificationRestore(req, res) {
//     const params = {
//         userId: req.token.id,
//         id: req.params.id
//     };
//
//     try {
//         let data = await repository.notificationRestore(params);
//
//         let httpCode = 200;
//         let error;
//         let content;
//
//         switch (data.executionCode) {
//             case 1:
//                 httpCode = 404;
//                 error = data;
//                 break;
//             default:
//                 content = {
//                     message: 'Notificação restaurada com sucesso'
//                 }
//         }
//
//         return res.finish({
//             httpCode: httpCode,
//             error,
//             content
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function notificationMarkOpen(req, res) {
//     const params = {
//         userId: req.token.id,
//         id: req.params.id
//     };
//
//     try {
//         let data = await repository.notificationMarkOpen(params);
//
//         let httpCode = 200;
//         let error;
//         let content;
//
//         switch (data.executionCode) {
//             case 1:
//                 httpCode = 404;
//                 error = data;
//                 break;
//             default:
//                 content = {
//                     message: 'Notificação marcada como aberta com sucesso'
//                 }
//         }
//
//         return res.finish({
//             httpCode: httpCode,
//             error,
//             content
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function selectTvshow(req, res) {
//     const params = {
//         userId: req.token.id,
//         type: req.body.type,
//         search: req.body.search,
//         orderBy: req.body.orderBy,
//         genres: req.body.genres && req.body.genres.length ? req.body.genres : null,
//         showArchived: req.body.showArchived,
//         unless: req.body.unless && req.body.unless.length ? req.body.unless : null
//     };
//
//     try {
//         await scope.selectTvshow(params);
//     } catch (err) {
//         return res.finish({
//             httpCode: 400,
//             error: err
//         });
//     }
//
//     try {
//         let data = await repository.selectTvshow(params);
//
//         return res.finish({
//             httpCode: 200,
//             content: data
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
//
// async function markEpisodeAsWatched(req, res) {
//     const params = {
//         userId: req.token.id,
//         tvshowId: req.body.tvshowId,
//         id: req.params.id
//     };
//
//     try {
//         await scope.markEpisodeAsWatched(params);
//     } catch (err) {
//         return res.finish({
//             httpCode: 400,
//             error: err
//         });
//     }
//
//     try {
//         let data = await repository.markEpisodeAsWatched(params);
//
//         let httpCode = 200;
//         let error;
//         let nextEpisode;
//
//         switch (data.executionCode) {
//             case 1:
//                 httpCode = 404;
//                 error = data;
//                 break;
//             default:
//                 nextEpisode = data.nextEpisode
//         }
//
//         return res.finish({
//             httpCode: httpCode,
//             error,
//             content: nextEpisode
//         });
//     } catch (err) {
//         return res.finish({
//             httpCode: 500,
//             error: err
//         });
//     }
// }
