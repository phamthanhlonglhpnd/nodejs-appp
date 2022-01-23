import jwtHelper from '../helpers/jwt.helper';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

let isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.headers["x-access-token"];
    if(tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch(e) {
            return res.status(401).json({
                message: 'Unauthorized.',
            });
        }
    } else {
        return res.status(403).send({
            errMessage: 'No token provided.',
        });
    }
}

module.exports = {
    isAuth
}