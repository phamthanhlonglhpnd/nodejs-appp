import db from '../models/index';
require('dotenv').config();
import emailService from '../services/emailService';
import {v4 as uuidv4} from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

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

            let token = uuidv4();
            await emailService.sendSimpleEmail({
                receiveEmail: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                doctorName: data.doctorName,
                language: data.language,
                receiveLink: buildUrlEmail(data.doctorId, token),
                time: data.time
            });

            if(patient && patient[0]) {
                // await db.Booking.findOrCreate({
                    // where: {
                    //     patientId: patient[0].id,
                    //     date: data.date,
                    //     timeType: data.timeType
                    // },
                //     defaults: {
                        // statusId: 'S1',
                        // doctorId: data.doctorId,
                        // patientId: patient[0].id,
                        // date: data.date,
                        // timeType: data.timeType,
                        // token: token
                //     }
                // })
                // return {
                //     errCode: 0,
                //     errMessage: "OK!",
                // }
                let res = await db.Booking.findOne({
                    where: {
                        patientId: patient[0].id,
                        date: data.date,
                        timeType: data.timeType
                    },
                });
                if(res) {
                    return {
                        errCode: 1,
                        errMessage: "Booking has actived!"
                    }
                } else {
                    await db.Booking.create({
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: patient[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    });
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
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });
                if(booking) {
                    booking.statusId = 'S2';
                    await booking.save();
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
module.exports = {
    patientBookingService,
    postVerifyBookingService
}