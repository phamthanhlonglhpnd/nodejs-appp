import patientService from '../services/patientService';

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

module.exports = {
    patientBooking,
    postVerifyBooking
}