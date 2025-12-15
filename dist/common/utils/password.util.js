"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt = require("bcrypt");
class PasswordUtil {
    static async hash(password) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }
    static async compare(plainText, hashedPassword) {
        return await bcrypt.compare(plainText, hashedPassword);
    }
    static validateStrength(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        return strongPasswordRegex.test(password);
    }
}
exports.PasswordUtil = PasswordUtil;
PasswordUtil.SALT_ROUNDS = 10;
//# sourceMappingURL=password.util.js.map