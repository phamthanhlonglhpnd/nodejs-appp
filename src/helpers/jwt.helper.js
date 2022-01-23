const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife) => {
    try {
        let userData = {
            id: user.id,
            email: user.email,
            password: user.password
        };
        jwt.sign(
            {data: userData}, secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife
            }, (error, token) => {
                if(error) {
                    return error;
                };
                return token;
            }
        )
    } catch(e) {
        return e;
    }
}

let verifyToken = (token, secretKey) => {
    try {
        jwt.verify(token, secretKey, (error, decoded) => {
            if(error) {
                return error;
            }
            return decoded;
        })
    } catch (e) {
        return e;
    }
}

module.exports = {
    generateToken, verifyToken
}