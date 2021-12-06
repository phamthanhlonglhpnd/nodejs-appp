import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist) {
                let user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id'],
                    raw: true
                })
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK!";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found!";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Your email is not exist in system!";
            }
            resolve(userData);
        } catch(e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if(user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if(userId==="ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                })
            } 
            if(userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    },
                })
            }
            resolve(users);
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

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let emailExist = await checkUserEmail(data.email);
            let hashPassword = await hashUserPassword(data.password);
            // if(!data.email || !data.password || !data.firstName || !data.lastName || !data.address || !data.phonenumber || !data.gender || !data.roleId) {
            //     resolve({
            //         errCode: 1,
            //         errMessage: "Plz fill this field!"
            //     })
            // } 
            if(emailExist) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is exist in system. Plz try another email!"
                })
            } else {
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.image
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                });    
            }
        } catch(e) {
            reject(e);
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            if(!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User not found!"
                })
            } else {
                await db.User.destroy({
                    where: {id: id}
                })
                resolve({
                    errCode: 0,
                    errMessage: "Delete success!"
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id || !data.positionId ||!data.roleId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing params!"
                })
            } else {
                let user = await db.User.findOne({
                    where: {id: data.id},
                    raw: false
                })
                if(!user) {
                    resolve({
                        errCode: 1,
                        errMessage: "User not found!"
                    })
                } else {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.phonenumber = data.phonenumber;
                    user.gender = data.gender;
                    user.roleId = data.roleId;
                    user.positionId = data.positionId
                    if(data.image) {
                        user.image = data.image
                    }
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update success!"
                    });
                }
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getAllcodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if(!type) {
                res.errCode = 1;
                res.errMessage = 'Missing params!';
            } else {
                let allCode = await db.Allcode.findAll({
                    where: {type: type}
                });
                res.errCode = 0;
                res.data = allCode;
            }
            resolve(res);
        } catch(e) {
            reject(e);
        }
    })
}


module.exports = {
    handleUserLogin, 
    getAllUsers, 
    createNewUser,
    deleteUser,
    editUser,
    getAllcodeService,
}
