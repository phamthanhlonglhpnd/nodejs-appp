import { query } from 'express';
import specialtyService from '../services/specialtyService';

let createInforSpecilty = async (req, res) => {
    try {
        let specialty = await specialtyService.createInforSpeciltyService(req.body);
        return res.status(200).json(specialty);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getInforSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.getInforSpecialtyService();
        return res.status(200).json(specialty);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getGeneralSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.getGeneralSpecialtyService();
        return res.status(200).json(specialty);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.getDetailSpecialtyService(req.query.id, req.query.location);
        return res.status(200).json(specialty);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let deleteSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.deleteSpecialtyService(req.body.id);
        return res.status(200).json(data);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
    
}

let updateSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.updateSpecialtyService(req.body);
        return res.status(200).json(data);
    } catch(e){
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
    createInforSpecilty,
    getInforSpecialty,
    getGeneralSpecialty,
    getDetailSpecialty,
    deleteSpecialty,
    updateSpecialty
}