import jwtHelper from '../helpers/jwt.helper';
import userService from '../services/userService';
// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList  = {};

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

let login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if(!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: "Missing input parameters"
            })
        }

        let userData = await userService.handleUserLogin(email, password)
        // let userData = {
        //     id: req.body.id,
        //     email: req.body.email
        // };
        const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
        const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);
        // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
        // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
        tokenList[refreshToken] = {accessToken, refreshToken};
        return res.status(200).json({accessToken, refreshToken});
    } catch(e) {
        return res.status(500).json(e);
    }
}

let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    let refreshTokenFromClient = req.body.refreshToken;
    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if(refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data;
            const userData = decoded.data;

            const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({accessToken});
        } catch(e) {
            res.status(403).json({
                message: 'Invalid refresh token.',
              });
        }
    } else {
        return res.status(403).send({
            message: 'No token provided.',
          });
    }
}

module.exports = {
    login,
    refreshToken
}