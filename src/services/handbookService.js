import db from '../models/index';

let createInforHandbookService = async (data) => {
    try {
        if(!data.title 
                || !data.image 
                || !data.specialtyId
                || !data.descriptionHTML
            ) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            } 
        } else {
            await db.Specialty_Clinic_Handbook.create({
                title: data.title,
                image: data.image,
                specialtyId: data.specialtyId,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
            });
            return {
                errCode: 0,
                errMessage: "OK!"
            }
        }
        
    } catch(e) {
        return e;
    }
}

let getAllHandbookService = async () => {
    try {
        let handbooks = await db.Specialty_Clinic_Handbook.findAll({
            include: [
                { model: db.Specialty, as: 'specialtyHandbook', attributes: ['name']}
            ],
            raw: true,
            nest: true
        });
       
            return {
                errCode: 0,
                errMessage: " OK!",
                handbooks
            }
       
    } catch(e) {
        return e;
    }
}

let deleteHandbookService = async (id) => {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            }
        } else {
            let handbook = await db.Specialty_Clinic_Handbook.findOne({
                where: {id: id}
            });
            if(!handbook) {
                return {
                    errCode: 2,
                    errMessage: "Not found!"
                }
            } else {
                await db.Specialty_Clinic_Handbook.destroy({
                    where: {id: id}
                });
                return {
                    errCode: 0,
                    errMessage: "OK!"
                }
            }    
        }
    } catch (e) {
        return e;
    }
}

let updateHandbookService = async (data) => {
    try {
        if(!data.id 
                || !data.title 
                || !data.specialtyId
            ) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let handbook = await db.Specialty_Clinic_Handbook.findOne({
                where: {id: data.id},
                raw: false
            });
            if(!handbook) {
                return {
                    errCode: 2,
                    errMessage: "Not found!"
                }
            } else {
                handbook.title = data.title;
                handbook.specialtyId = data.specialtyId;
                handbook.descriptionHTML = data.descriptionHTML;
                handbook.descriptionMarkdown = data.descriptionMarkdown;
                if(data.image) {
                    handbook.image = data.image;
                }
                await handbook.save();
                return {
                    errCode: 0,
                    errMessage: "Update success!"
                }
            }
        }
    } catch(e) {
        return e;
    }
}

let getHomeHandbookService = async () => {
    try {
        let handbooks = await db.Specialty_Clinic_Handbook.findAll({
            attributes: ['id', 'image', 'title',],
            include: [
                { model: db.Specialty, as: 'specialtyHandbook', attributes: ['name']}
            ],
            raw: true,
            nest: true
        });
        if(handbooks) {
            return {
                errCode: 0,
                errMessage: " OK!",
                handbooks
            }
        } else {
            return {
                errCode: 1,
                errMessage: "Find specialty fail!"
            }
        }
    } catch(e) {
        return e;
    }
}

let getDetailHandbookService = async (id) =>  {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            } 
        } else {
            let handbook = await db.Specialty_Clinic_Handbook.findOne({
                where: {
                    id: id
                },
                include: [
                    { model: db.Specialty, as: 'specialtyHandbook', attributes: ['name']}
                ],
                raw: true,
                nest: true
            });
            return {
                errCode : 0,
                errMessage: "OK!",
                handbook
            }
        }
    } catch(e) {
        return e;
    }
}

module.exports = {
    createInforHandbookService,
    getAllHandbookService,
    deleteHandbookService,
    updateHandbookService,
    getHomeHandbookService,
    getDetailHandbookService
}