const User = require("../models/User");
const TemporaryCode = require("../models/TemporaryCode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
    async getUser(data) {
        if (data.id) return await User.findById(data.id);
        else if (data.email) return await User.findOne({ email: data.email });
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
    async createUser(email, password) {
        const hashed = await this.hashPassword(password);
        return await User.create({ email, password: hashed });
    }


    async comparePasswords(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    async saveTemporaryCode() {
        let code = 0;
        while (code < 10000) {
            code = Math.floor(Math.random() * 100000)
        }
        const temporaryCode = await TemporaryCode.create({code});
        return temporaryCode;
    }

    async removeTemporaryCode(id) {
        await TemporaryCode.findByIdAndDelete(id);
    }

    async checkCode(code, id) {
        const temporaryCode = await TemporaryCode.findById(id);
        if (!temporaryCode) return {match: false};
        return {match: temporaryCode.code == code};
    }

    async createRefreshToken(user, token) {
        user.refreshToken = token;
        return await user.save();
    }

    generateTokens(data) {
        const accessToken = jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: "1h"});
        const refreshToken = jwt.sign(data, process.env.REFRESH_SECRET, {expiresIn: "30d"});
        return {
            accessToken, refreshToken
        };
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.ACCESS_SECRET);
        } catch (err) {
            return null;
        }
    }
}

module.exports = new AuthService();