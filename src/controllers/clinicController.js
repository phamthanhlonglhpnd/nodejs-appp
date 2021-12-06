import clinicService from '../services/clinicService';

let createInforClinic = async (req, res) => {
    try {
        let clinic = await clinicService.createInforClinicService(req.body);
        return res.status(200).json(clinic);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let clinic = await clinicService.getAllClinicService();
        return res.status(200).json(clinic);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getHomeClinic = async (req, res) => {
    try {
        let clinic = await clinicService.getHomeClinicService();
        return res.status(200).json(clinic);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailClinic = async (req, res) => {
    try {
        let clinic = await clinicService.getDetailClinicService(req.query.id);
        return res.status(200).json(clinic);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let deleteClinic = async (req, res) => {
    try {
        let data = await clinicService.deleteClinicService(req.body.id);
        return res.status(200).json(data);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let updateClinic = async (req, res) => {
    try {
        let data = await clinicService.updateClinicService(req.body);
        return res.status(200).json(data);
    } catch(e){
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}


module.exports = {
    createInforClinic,
    getAllClinic,
    getHomeClinic,
    getDetailClinic,
    deleteClinic,
    updateClinic
}