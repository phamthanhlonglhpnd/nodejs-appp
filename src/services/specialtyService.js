import db from '../models/index';

let createInforSpeciltyService = async (data) => {
    try {
        if(!data.name || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            } 
        } else {
            await db.Specialty.create({
                name: data.name,
                image: data.image,
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

let getInforSpecialtyService = async() => {
    try {
        let specialty = await db.Specialty.findAll();
        if(specialty) {
            return {
                errCode: 0,
                errMessage: " OK!",
                specialty
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

let getGeneralSpecialtyService = async () => {
    try {
        let specialty = await db.Specialty.findAll({
            attributes: {
                exclude: ['descriptionHTML', 'descriptionMarkdown', 'createdAt', 'updatedAt', 'image']
            }
        });
        if(specialty) {
            return {
                errCode: 0,
                errMessage: " OK!",
                specialty
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

let getDetailSpecialtyService = async (id, location) => {
    try {
        if(!id || !location) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            } 
        } else {
            let specialty = await db.Specialty.findOne({
                where: {
                    id: id
                },
                attributes: ['descriptionHTML', 'descriptionMarkdown', 'image']
                
            });
            let doctors = [];
            if(location==='ALL') {
                doctors = await db.Doctor_Infor.findAll({
                    where: {specialtyId: id},
                    attributes: ['doctorId', 'provinceId']
                })
            } else {
                doctors = await db.Doctor_Infor.findAll({
                    where: {
                        specialtyId: id,
                        provinceId: location
                    },
                    attributes: ['doctorId', 'provinceId']
                })
            } return {
                errCode : 0,
                errMessage: "OK!",
                specialty,
                doctors
            }
        }
    } catch(e) {
        return e;
    }
}

let deleteSpecialtyService = async (id) => {
    try {
        if(!id) {
            return {
                errCode: 1,
                errMessage: "Missing param!"
            }
        } else {
            let data = await db.Specialty.findOne({
                where: {id: id}
            });
            if(!data) {
                return {
                    errCode: 2,
                    errMessage: "Not found!"
                }
            } else {
                await db.Specialty.destroy({
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

let updateSpecialtyService = async (data) => {
    try {
        if(!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                errMessage: "Missing params!"
            }
        } else {
            let specialty = await db.Specialty.findOne({
                where: {id: data.id},
                raw: false
            });
            if(!specialty) {
                return {
                    errCode: 2,
                    errMessage: "Not found!"
                }
            } else {
                specialty.name = data.name;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                if(data.image) {
                    specialty.image = data.image;
                }
                await specialty.save();
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

module.exports = {
    createInforSpeciltyService,
    getInforSpecialtyService,
    getGeneralSpecialtyService,
    getDetailSpecialtyService,
    deleteSpecialtyService,
    updateSpecialtyService
}