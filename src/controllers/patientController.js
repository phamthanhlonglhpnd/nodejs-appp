import patientService from '../services/patientService';

let getPatientInformation = async (req, res) => {
    try {
        let infor = await patientService.getPatientInformationService(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let patientBooking = async (req, res) => {
    try {
        let booking = await patientService.patientBookingService(req.body);
        return res.status(200).json(booking)
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let postVerifyBooking = async (req, res) => {
    try {
        let booking = await patientService.postVerifyBookingService(req.body);
        return res.status(200).json(booking)
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getMedicalHistory = async (req, res) => {
    try {
        let history = await patientService.getMedicalHistoryService(req.query.id);
        return res.status(200).json(history)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getMedicalBooking = async (req, res) => {
    try {
        let history = await patientService.getMedicalBookingService(req.query.id);
        return res.status(200).json(history)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let cancelBooking = async (req, res) => {
    try {
        let history = await patientService.cancelBookingService(req.body);
        return res.status(200).json(history)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let updateInformation = async (req, res) => {
    try {
        let infor = await patientService.updateInformationService(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
    getPatientInformation,
    patientBooking,
    postVerifyBooking,
    getMedicalHistory,
    getMedicalBooking,
    cancelBooking,
    updateInformation
}