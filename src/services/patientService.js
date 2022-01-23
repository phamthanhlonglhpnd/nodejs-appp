import db from '../models/index';
require('dotenv').config();
import emailService from '../services/emailService';
import {v4 as uuidv4} from 'uuid';
const { Op } = require("sequelize");

let getPatientInformationService = async (id) => {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let infor = await db.User.findOne({
                where: {
                    id: id
                },
                attributes: {
                    exclude: ['password','roleId', 'positionId', 'createdAt', 'updatedAt']
                },
                include: [
                    { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn']}
                ],
                raw: true,
                nest: true
            })
            return {
                errCode: 0,
                errMessage: "OK",
                infor
            }
        }
    } catch(e) {
        return e;
    }
}

let buildUrlEmail = (doctorId, token, date, timeType) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}&date=${date}&timeType=${timeType}`;
    return result;
}

let isBookAble = async (data) => {
    let schedule = await db.Schedule.findOne({
        where: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType
        },
        attributes: [ 'id', 'doctorId', 'date', 'timeType', 'maxNumber', 'currentNumber' ],
        raw: false
    });

    if (schedule) {
        return schedule.currentNumber < schedule.maxNumber;
    }
    return false;
};

let patientBookingService = async (data) => {
    try {
        if(!data.email || !data.doctorId || !data.date || !data.timeType) {
            return {
                errCode: 1, 
                errMessage: "Missing param!"
            }
        } else {
            let patient = await db.User.findOrCreate({
                where: {email: data.email},
                defaults: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    roleId: 'R3',
                    gender: data.gender,
                    phonenumber: data.phonenumber,
                    address: data.address
                }
            });

            let checkNumber = await isBookAble(data);
            let token = uuidv4();
            await emailService.sendSimpleEmail({
                receiveEmail: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                doctorName: data.doctorName,
                language: data.language,
                receiveLink: buildUrlEmail(data.doctorId, token, data.date, data.timeType),
                time: data.time
            });

            if(patient && patient[0]) {
                let res = await db.Booking.findOne({
                    where: {
                        patientId: patient[0].id,
                        date: data.date,
                        timeType: data.timeType
                    },
                });
                if(res) {
                    return {
                        errCode: 3,
                        errMessage: "Booking has actived!"
                    }
                } else {
                    if(!checkNumber) {
                        return {
                            errCode: 2,
                            errMessage: "Exceed the allowed amount!"
                        }
                    } else {
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: patient[0].id,
                            reason: data.reason,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        });
                    }
                    return {
                        errCode: 0,
                        errMessage: "OK!"
                    }
                }
            }
        }
    } catch(e) {
        return e;
    }
}

let postVerifyBookingService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing param!"
                })
            } else {
                let booking = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });
                let schedule = await db.Schedule.findOne({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType
                    },
                    raw: false
                });
                if(booking) {
                    booking.statusId = 'S2';
                    await booking.save();
                    let currentNumber = +schedule.currentNumber;
                    await schedule.update({
                        currentNumber: currentNumber + 1
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "Update success!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Booking has been actived or does not exist!"
                    })
                }
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getMedicalHistoryService = async (id) => {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let history = await db.Booking.findAll({
                where: {
                    patientId: id, 
                    statusId: "S3"
                },
                include: [
                    { model: db.Allcode, as: 'timeDatas', attributes: ['valueVi', 'valueEn']},
                    { model: db.Allcode, as: 'status', attributes: ['valueVi', 'valueEn']},
                    { model: db.User, as: 'doctor', attributes: ['firstName', 'lastName']},
                ],
                raw: true,
                nest: true
            })
            return {
                errCode: 0,
                errMessage: "OK",
                history
            }
        }
    } catch(e) {
        return e;
    }
}

let getMedicalBookingService = async (id) => {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let history = await db.Booking.findAll({
                where: {
                    patientId: id, 
                    [Op.or]: [
                        { statusId: "S1" },
                        { statusId: "S2" }
                    ]
                },
                include: [
                    { model: db.Allcode, as: 'timeDatas', attributes: ['valueVi', 'valueEn']},
                    { model: db.Allcode, as: 'status', attributes: ['valueVi', 'valueEn']},
                    { model: db.User, as: 'doctor', attributes: ['firstName', 'lastName']},
                ],
                raw: true,
                nest: true
            })
            return {
                errCode: 0,
                errMessage: "OK",
                history
            }
        }
    } catch(e) {
        return e;
    }
}

let cancelBookingService = async (data) => {
    try {
        if(!data.patientId || !data.doctorId || !data.date || !data.timeType) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let history = await db.Booking.findOne({
                where: {
                    patientId: data.patientId, 
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType
                },
                raw: false
            });
            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType
                },
                raw: false
            });
            history.statusId = "S4";
            await history.save();
            let currentNumber = +schedule.currentNumber;
            await schedule.update({
                currentNumber: currentNumber - 1
            })     
            return {
                errCode: 0,
                errMessage: "OK",
            }
        }
    } catch(e) {
        return e;
    }
}

let updateInformationService = async (data) => {
    try {
        if(!data.id || !data.email || !data.firstName || !data.lastName) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let user = await db.User.findOne({
                where: {
                    id: data.id, 
                },
                raw: false
            });
            if(!user) {
                return {
                    errCode: 1,
                        errMessage: "User not found!"
                }
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
                    return {
                        errCode: 0,
                        errMessage: "OK",
                    }
            }
            
        }
    } catch(e) {
        return e;
    }
}

let getAllBookingService = async (date) => {
    try {
        if(!date) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let bookingData = await db.Booking.findAll({
                where: {
                    date: date
                },
                attributes: ['id', 'statusId'],
                raw: false,
            })
            return {
                errCode: 0,
                errMessage: "OK",
                bookingData
            }
        }
    } catch(e) {
        return e;
    }
}

let getAllPatientsService = async (page) => {
    try {
        if(!page) {
            page = 100;
        } else {
            let patients = await db.User.findAll({
                where: {
                    roleId: 'R3'
                },
                attributes: ['firstName', 'lastName'],
                limit: page,
            });
            return {
                errCode: 0,
                errMessage: "OK",
                patients
            }
        }
    } catch(e) {
        return e;
    }
}

module.exports = {
    getPatientInformationService,
    patientBookingService,
    postVerifyBookingService,
    getMedicalHistoryService,
    getMedicalBookingService,
    cancelBookingService,
    updateInformationService,
    getAllBookingService,
    getAllPatientsService
}