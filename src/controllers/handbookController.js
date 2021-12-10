import handbookService from '../services/handbookService';

let createInforHandbook = async (req, res) => {
    try {
        let handbook = await handbookService.createInforHandbookService(req.body);
        return res.status(200).json(handbook);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let handbooks = await handbookService.getAllHandbookService();
        return res.status(200).json(handbooks);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getHomeHandbook = async (req, res) => {
    try {
        let handbooks = await handbookService.getHomeHandbookService();
        return res.status(200).json(handbooks);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailHandbook = async (req, res) => {
    try {
        let handbook = await handbookService.getDetailHandbookService(req.query.id);
        return res.status(200).json(handbook);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let deleteHandbook = async (req, res) => {
    try {
        let data = await handbookService.deleteHandbookService(req.body.id);
        return res.status(200).json(data);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let updateHandbook = async (req, res) => {
    try {
        let data = await handbookService.updateHandbookService(req.body);
        return res.status(200).json(data);
    } catch(e){
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}


module.exports = {
    createInforHandbook,
    getAllHandbook,
    getHomeHandbook,
    getDetailHandbook,
    deleteHandbook,
    updateHandbook
}