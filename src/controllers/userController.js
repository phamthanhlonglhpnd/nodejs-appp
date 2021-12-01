import db from '../models/index';
import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing input parameters"
        })
    }

    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing params!",
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let data = await userService.createNewUser(req.body);
    return res.status(200).json({
        data
    })
}

let handleEditUser = async (req, res) => {
    let data = await userService.editUser(req.body);
    return res.status(200).json(data);
}

let handleDeleteUser = async (req, res) => {
    let id = req.body.id;
    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing params!"
        })
    }
    let data = await userService.deleteUser(id);
    return res.status(200).json(data);
}

let getAllcode = async (req, res) => {
    try {
        let data = await userService.getAllcodeService(req.query.type);
        return res.status(200).json(data);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUsers, 
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllcode,
    
}