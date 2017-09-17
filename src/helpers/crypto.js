const crypto = require("crypto");
const algorithm = "aes-256-ctr";

module.exports = {
    encrypt,
    decrypt
};

function encrypt(obj) {
    try {
        let cipher = crypto.createCipher(algorithm, global.config.secret.key);
        let crypted = cipher.update(JSON.stringify(obj), "utf8", "hex");
        crypted += cipher.final("hex");

        return crypted;
    } catch (e) {
        return { error: e.message };
    }
}

function decrypt(token) {
    try {
        let decipher = crypto.createDecipher(algorithm, global.config.secret.key);
        let dec = decipher.update(token, "hex", "utf8");
        dec += decipher.final("utf8");

        return JSON.parse(dec);
    } catch (e) {
        return { error: e.message };
    }
}
