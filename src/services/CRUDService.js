import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === "1" ? true : false,
                roleId: data.roleId,
            })
            resolve('Success!');
        } catch(e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch(e) {
            reject(e);
        }
    })
}

let getAllUsers = () => {
    return new Promise( async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch(e) {
            reject(e);
        }
    })
}

let getEditUser = (id) => {
    return new Promise (async (resolve, reject) => {
        try {
            let user = await db.User.findByPk(id);
            resolve(user);
        } catch(e) {
            reject(e);
        }
    })
}

let postUpdateUser = (data) => {
    return new Promise (async (resolve, reject) => {
        try {
            let user = await db.User.findByPk(data.id);
            if(user) {
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
            } else {
                alert("User not found");
            }
            await user.save();
            resolve(user);
        } catch(e) {
            reject(e);
        }
    })
}

let deleteUser = (id) => {
    return new Promise( async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            await user.destroy();
            resolve(user);
        } catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser,
    getAllUsers,
    getEditUser,
    postUpdateUser,
    deleteUser
}