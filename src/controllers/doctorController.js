import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    try {
        let doctors = await doctorService.getTopDoctorHomeService();
        return res.status(200).json(doctors);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService();
        return res.status(200).json(doctors);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let postInforDoctor = async(req, res) => {
    try {
        let doctors = await doctorService.postInforDoctorService(req.body);
        return res.status(200).json(doctors);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorService(req.query.id);
        return res.status(200).json(infor);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let fixInforDoctor = async (req, res) => {
    try {
        let infor = await doctorService.fixInforDoctorService(req.body);
        return res.status(200).json(infor);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(infor);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let schedule = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(schedule);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getGeneralClinic = async (req, res) => {
    try {
        let clinic = await doctorService.getGeneralClinicService(req.query.doctorId);
        return res.status(200).json(clinic);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getIntroDoctor = async (req, res) => {
    try {
        let intro = await doctorService.getIntroDoctorService(req.query.id);
        return res.status(200).json(intro);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getMarkdownDoctor = async (req, res) => {
    try {
        let markdown = await doctorService.getMarkdownDoctorService(req.query.id);
        return res.status(200).json(markdown);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDoctorForBooking = async (req, res) => {
    try {
        let inforDoctor = await doctorService.getDoctorForBookingService(req.query.doctorId, req.query.date);
        return res.status(200).json(inforDoctor);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDoctorsBySpecialty = async (req, res) => {
    try {
        let doctors = await doctorService.getDoctorsBySpecialtyService(req.query.specialtyId);
        return res.status(200).json(doctors);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getPatients = async (req, res) => {
    try {
        let patients = await doctorService.getPatientsSerivce(req.query.doctorId, req.query.date)
        return res.status(200).json(patients);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let sendPrescription = async (req, res) => {
    try {
        let booking = await doctorService.sendPrescriptionSerivce(req.body)
        return res.status(200).json(booking);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getDetailDoctor,
    fixInforDoctor,
    bulkCreateSchedule,
    getScheduleByDate,
    getGeneralClinic,
    getIntroDoctor,
    getMarkdownDoctor,
    getDoctorForBooking,
    getDoctorsBySpecialty,
    getPatients,
    sendPrescription
}