import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);
        return res.render("homepage.ejs", {
            data: JSON.stringify(data)
        });
    } catch(e) {
        console.log(e);
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.redirect("/get-crud");
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers();
    return res.render("displayCRUD.ejs", {
        data: data
    })
}

let getEditCRUD = async (req, res) => {
    let userID = req.params.id;
    let data = await CRUDService.getEditUser(userID);
    return res.render("editUser.ejs", {
        data: data
    })
}

let postUpdateCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.postUpdateUser(data);
    return res.redirect("/get-crud");
}

let deleteCRUD = async (req, res) => {
    let id = req.params.id;
    await CRUDService.deleteUser(id);
    return res.redirect("/get-crud");
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    postUpdateCRUD,
    deleteCRUD
}