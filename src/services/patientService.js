import db from '../models/index';
import emailService from '../services/emailService';
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
                    email: data.email,
                    roleId: 'R3'
                }
            });

            await emailService.sendSimpleEmail({
                receiveEmail: data.email,
                patientName: data.patientName,
                doctorName: data.doctorName,
                language: data.language,
                receiveLink: 'https://sequelize.org/master/index.html',
                time: data.time
            });

            if(patient && patient[0]) {
                await db.Booking.findOrCreate({
                    where: {
                        patientId: patient[0].id,
                        date: data.date,
                        timeType: data.timeType
                    },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: patient[0].id,
                        date: data.date,
                        timeType: data.timeType
                    }
                })
            }
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
    patientBookingService
}