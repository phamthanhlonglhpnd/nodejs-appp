import db from '../models/index';
import _ from 'lodash';
require("dotenv").config();
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                }, 
                attributes: ['image', 'id', 'firstName', 'lastName', 'positionId'],
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Doctor_Infor,
                        attributes: [],
                        include: [
                            { model: db.Specialty, as: 'specialty', attributes: ['id', 'name']}
                        ]
                    }
                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                errMessage: "OK!",
                doctors
            });
        } catch(e) {
            reject(e);
        }
    })
}

let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            if(doctors) {
                resolve({
                    errCode: 0,
                    errMessage: "OK!",
                    doctors
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Find doctors fail!"
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let postInforDoctorService = (doctorInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorInput.doctorId 
                || !doctorInput.contentHTML 
                || !doctorInput.contentMarkdown 
                || !doctorInput.action
                || !doctorInput.addressClinic
                || !doctorInput.nameClinic
                || !doctorInput.paymentId
                || !doctorInput.priceId
                || !doctorInput.provinceId
                || !doctorInput.specialtyId
                ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                if(doctorInput.action==="CREATE") {
                    await db.Markdown.create({
                        contentHTML: doctorInput.contentHTML,
                        contentMarkdown: doctorInput.contentMarkdown,
                        doctorId: doctorInput.doctorId,
                        description: doctorInput.description
                    });
                }
                else if(doctorInput.action==="EDIT") {
                    let infor = await db.Markdown.findOne({
                        where: { doctorId: doctorInput.doctorId},
                        raw: false
                    });
                    if(infor) {
                        infor.description = doctorInput.description;
                        infor.contentHTML = doctorInput.contentHTML;
                        infor.contentMarkdown = doctorInput.contentMarkdown;
                        await infor.save();
                    }
                }

                let inforDoctor = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorInput.doctorId},
                    raw: false
                })

                if(inforDoctor) {
                    inforDoctor.specialtyId = doctorInput.specialtyId;
                    inforDoctor.priceId = doctorInput.priceId;
                    inforDoctor.provinceId = doctorInput.provinceId;
                    inforDoctor.paymentId = doctorInput.paymentId;
                    inforDoctor.addressClinic = doctorInput.addressClinic;
                    inforDoctor.nameClinic = doctorInput.nameClinic;
                    inforDoctor.note = doctorInput.note;
                    await inforDoctor.save();
                } else {
                    await db.Doctor_Infor.create({
                        specialtyId: doctorInput.specialtyId,
                        priceId: doctorInput.priceId,
                        provinceId: doctorInput.provinceId,
                        paymentId: doctorInput.paymentId,
                        addressClinic: doctorInput.addressClinic,
                        nameClinic: doctorInput.nameClinic,
                        note: doctorInput.note,
                        doctorId: doctorInput.doctorId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save infor doctor succcess!"
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getDetailDoctorService = (id) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                let infor = await db.User.findOne({
                    where: {id: id},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    ],
                    raw: true,
                    nest: true
                });
                let inforDoctor = await db.Doctor_Infor.findOne({
                    where: {doctorId: id},
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Specialty, as: 'specialty', attributes: ['id', 'name'] },
                        { model: db.Clinic, as: 'clinic', attributes: ['id', 'name'] },
                    ],
                    raw: true,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    errMessage: "OK!",
                    infor,
                    inforDoctor
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let fixInforDoctorService = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                let infor = await db.Markdown.findOne({
                    where: {doctorId: data.doctorId},
                    raw: true
                })
                infor.description = data.description;
                infor.contentHTML = data.contentHTML;
                infor.contentMarkdown = data.contentMarkdown;
                await infor.save();
                resolve({
                    errCode: 0,
                    errMessage: "OK!",
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let exist = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date}, 
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                // let compare = _.differenceWith(schedule, exist, (a, b) => {
                //     return a.timeType===b.timeType && a.date===b.date;
                // });

                let compare = schedule
                    .filter(item => !exist
                                .find(other => Object.keys(other)
                                .every(prop => item[prop] == other[prop]))
                    );
                
                if(compare && compare.length>0) {
                    await db.Schedule.bulkCreate(compare);
                }

                resolve({
                    errCode: 0,
                    errMessage: "OK!"
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {   
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId, 
                        date: date
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        { model: db.Allcode, as: 'timeData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName', 'positionId']}
                    ],
                    raw: true,
                    nest: true

                });
                resolve({
                    errCode: 0, 
                    errMessage: "OK!", 
                    schedule
                })
            }

        } catch(e) {
            reject(e);
        }
    })
}

let deleteScheduleByDateService = async (doctorId, date, timeType) => {
    try {   
        if(!doctorId || !date || !timeType) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: doctorId, 
                    date: date,
                    timeType: timeType
                }
            });
            if(!schedule) {
                return {
                    errCode: 2,
                    errMessage: 'Fail!'
                }
            } else {
                await db.Schedule.destroy({
                    where: {
                        doctorId: doctorId, 
                        date: date,
                        timeType: timeType
                    }
                })
                return {
                    errCode: 0, 
                    errMessage: "OK!", 
                }
            }
            
        }

    } catch(e) {
        return e;
    }
}

let getGeneralClinicService = (doctorId) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                let clinic = await db.Doctor_Infor.findOne({
                    where: {doctorId: doctorId},
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: true,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    errMessage: "OK!",
                    clinic
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getIntroDoctorService = (id) => {
    return new Promise(async (resolve, reject) => {
        if(!id) {
            resolve({
                errCode: 1,
                errMessage: "Missing params!"
            })
        } else {
            let intro = await db.User.findOne({
                where: {id: id},
                attributes: {
                    exclude: ['password', 'email', 'phonenumber', 'address', 'roleId', 'gender', 'createdAt', 'updatedAt']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Markdown, attributes: ['description'] },
                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                errMessage: "OK!",
                intro
            }) 
        }
    })
}

// let getMarkdownDoctorService = (id) => {
//     return new Promise (async (resolve, reject) => {
//         try {
//             if(!id) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: "Missing params!"
//                 })
//             } else {
//                 let markdown = await db.User.findOne({
//                     where: {id: id},
//                     attributes: {
//                         exclude: ['password', 'firstName', 'lastName', 'positionId', 'image', 'email', 'phonenumber', 'address', 'roleId', 'gender', 'createdAt', 'updatedAt']
//                     },
//                     include: [
//                         { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown'] }
//                     ],
//                     raw: true,
//                     nest: true
//                 });
//                 resolve({
//                     errCode: 0,
//                     errMessage: "OK!",
//                     markdown
//                 })
//             }
//         } catch(e) {
//             reject(e);
//         }
//     })
// }

let getDoctorForBookingService = (doctorId, date) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params!"
                })
            } else {
                let data = {};
                let doctor = await db.User.findOne({
                    where: {id: doctorId},
                    attributes: {
                        exclude: ['password', 'image', 'email', 'phonenumber', 'address', 'roleId', 'gender', 'createdAt', 'updatedAt']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: true,
                    nest: true
                });
                let price = await db.Doctor_Infor.findOne({
                    where: {doctorId: doctorId},
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'provinceId', 'paymentId', 'note', 'addressClinic', 'nameClinic']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: true,
                    nest: true
                });
                // let schedule = await db.Schedule.findAll({
                //     where: {
                //         doctorId: doctorId, 
                //         date: date
                //     },
                //     attributes: {
                //         exclude: ['createdAt', 'updatedAt', 'timeType']
                //     },
                //     include: [
                //         { model: db.Allcode, as: 'timeData', attributes: ['valueVi', 'valueEn'] }
                //     ],
                //     raw: true,
                //     nest: true

                // });
                data.doctor = doctor;
                data.price = price;
                // data.schedule = schedule;
                resolve({
                    errCode: 0,
                    errMessage: "OK!",
                    data
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getMarkdownDoctorService = async (id) => {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            }
        } else {
            let markdown = await db.User.findOne({
                where: {id: id},
                attributes: {
                    exclude: ['password', 'firstName', 'lastName', 'positionId', 'image', 'email', 'phonenumber', 'address', 'roleId', 'gender', 'createdAt', 'updatedAt']
                },
                include: [
                    { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown'] }
                ],
                raw: true,
                nest: true
            });
            return {
                errCode: 0,
                errMessage: "OK",
                markdown
            }
        }
    } catch(e) {
        return e;
    }
}

let getDoctorsBySpecialtyService = async (specialtyId) => {
    try {
        if(!specialtyId) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            }
        } else {
            let doctors = await db.Doctor_Infor.findAll({
                where: {specialtyId: specialtyId},
                attributes: {
                    exclude: ['paymentId', 'priceId', 'nameClinic', 'addressClinic', 'note', 'createdAt', 'updatedAt']
                },
                raw: true,
                nest: true
            });
            return {
                errCode: 0,
                errMessage: "OK",
                doctors
            }
        }
    } catch (e) {
        return e;
    }
}

let getPatientsSerivce = async (doctorId, date) => {
    try {
        if(!doctorId || !date) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            }
        } else {
            let patients = await db.Booking.findAll({
                where: {
                    doctorId: doctorId,
                    date: date,
                    statusId: 'S2'
                },
                include: [
                    {model: db.User, 
                        as: 'patients', 
                        attributes: ['firstName', 'lastName', 'email', 'phonenumber', 'gender', 'address'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn']}
                        ]
                    },
                    { model: db.Allcode, as: 'timeDatas', attributes: ['valueVi', 'valueEn']}
                ],
                raw: true,
                nest: true
            });
            return {
                errCode: 0,
                errMessage: "OK!",
                patients
            
            } 
        }
        

    } catch(e) {
        return e;
    }
}

let sendPrescriptionSerivce = async (data) => {
    try {
        if(!data.doctorId || !data.email || !data.patientId || !data.timeType) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            }
        } else {
            let booking = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    statusId: 'S2',
                    timeType: data.timeType
                },
                raw: false
            });
            
            if(booking) {
                booking.statusId = 'S3';
                await booking.save();   
            }
            await emailService.sendConfirmEmail(data);
            return {
                errCode: 0,
                errMessage: "OK!",
            }
        }
    } catch(e) {
        return e;
    }
}

module.exports = {
    getTopDoctorHomeService,
    getAllDoctorsService,
    postInforDoctorService,
    getDetailDoctorService,
    fixInforDoctorService,
    bulkCreateScheduleService,
    getScheduleByDateService,
    deleteScheduleByDateService,
    getGeneralClinicService,
    getIntroDoctorService,
    getMarkdownDoctorService,
    getDoctorForBookingService,
    getDoctorsBySpecialtyService,
    getPatientsSerivce,
    sendPrescriptionSerivce
}