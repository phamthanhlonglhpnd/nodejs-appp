import db from '../models/index';
import _ from 'lodash';
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                }, 
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] },
                ],
                raw: true,
                nest: true
            })
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
            if(!doctorInput.doctorId || !doctorInput.contentHTML || !doctorInput.contentMarkdown || !doctorInput.action) {
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
                        where: {doctorId: doctorInput.doctorId},
                        raw: false
                    });
                    if(infor) {
                        infor.description = doctorInput.description;
                        infor.contentHTML = doctorInput.contentHTML;
                        infor.contentMarkdown = doctorInput.contentMarkdown;
                        await infor.save();
                    }
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
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] }
                    ],
                    raw: true,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    errMessage: "OK!",
                    infor
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
                    include: [
                        { model: db.Allcode, as: 'timeData', attributes: ['valueVi', 'valueEn'] }
                    ],
                    raw: true,
                    nest: true

                });
                if(!schedule) schedule = [];
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


module.exports = {
    getTopDoctorHomeService,
    getAllDoctorsService,
    postInforDoctorService,
    getDetailDoctorService,
    fixInforDoctorService,
    bulkCreateScheduleService,
    getScheduleByDateService,
}