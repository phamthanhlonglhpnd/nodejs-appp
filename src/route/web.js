import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
import handbookController from '../controllers/handbookController';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-user/:id", homeController.getEditCRUD);
    router.post("/update-user", homeController.postUpdateCRUD);
    router.post("/delete-user/:id", homeController.deleteCRUD);

    router.post("/api/login", userController.handleLogin);
    router.post("/api/sign-up", userController.handleSignUp);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/api/search-information-doctor", userController.searchInformationDoctor);
    router.get("/api/search-information-specialty", userController.searchInformationSpecialty);
    router.get("/api/search-information-clinic", userController.searchInformationClinic);

    router.get("/api/allcode", userController.getAllcode);

    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
    router.get("/api/get-all-doctors", doctorController.getAllDoctors);
    router.post("/api/save-infor-doctor", doctorController.postInforDoctor);
    router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctor);
    router.put("/api/fix-infor-doctor", doctorController.fixInforDoctor);
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.get("/api/get-schedule-by-date", doctorController.getScheduleByDate);
    router.delete("/api/delete-schedule-by-date", doctorController.deleteScheduleByDate)
    router.get("/api/get-general-clinic", doctorController.getGeneralClinic);
    router.get("/api/get-intro-doctor", doctorController.getIntroDoctor);
    router.get("/api/get-markdown-doctor", doctorController.getMarkdownDoctor);
    router.get("/api/get-doctor-for-booking", doctorController.getDoctorForBooking);
    router.get("/api/get-doctors-by-specialty", doctorController.getDoctorsBySpecialty);
    router.get("/api/get-patients", doctorController.getPatients);
    router.post("/api/send-prescription", doctorController.sendPrescription);

    router.get("/api/get-patient-information", patientController.getPatientInformation);
    router.post("/api/patient-booking", patientController.patientBooking);
    router.post("/api/post-verify-booking", patientController.postVerifyBooking);
    router.get("/api/get-medical-history", patientController.getMedicalHistory);
    router.get("/api/get-medical-booking", patientController.getMedicalBooking);
    router.put("/api/cancel-booking", patientController.cancelBooking);
    router.put("/api/update-information", patientController.updateInformation);
    router.get("/api/get-all-booking", patientController.getAllBooking);
    router.get("/api/get-all-patients", patientController.getAllPatients);

    router.post("/api/create-infor-specialty", specialtyController.createInforSpecilty);
    router.get("/api/get-all-specialty", specialtyController.getInforSpecialty);
    router.get("/api/get-general-specialty", specialtyController.getGeneralSpecialty);
    router.get("/api/get-detail-specialty", specialtyController.getDetailSpecialty);
    router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);
    router.put("/api/update-specialty", specialtyController.updateSpecialty);

    router.post("/api/create-infor-clinic", clinicController.createInforClinic);
    router.get("/api/get-all-clinic", clinicController.getAllClinic);
    router.get("/api/get-home-clinic", clinicController.getHomeClinic);
    router.get("/api/get-detail-clinic", clinicController.getDetailClinic);
    router.delete("/api/delete-clinic", clinicController.deleteClinic);
    router.put("/api/update-clinic", clinicController.updateClinic);

    router.post("/api/create-infor-handbook", handbookController.createInforHandbook);
    router.get("/api/get-all-handbook", handbookController.getAllHandbook);
    router.get("/api/get-home-handbook", handbookController.getHomeHandbook);
    router.get("/api/get-detail-handbook", handbookController.getDetailHandbook);
    router.delete("/api/delete-handbook", handbookController.deleteHandbook);
    router.put("/api/update-handbook", handbookController.updateHandbook);

    router.post("/api/login-token", authController.login);
    router.post("/api/refresh-token", authController.refreshToken)
    // router.use(authMiddleware.isAuth);

    return app.use("/", router);
}

module.exports = initWebRoutes;