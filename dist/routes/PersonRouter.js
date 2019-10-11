"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PersonController_1 = require("../controllers/PersonController");
class PatientRouter {
    constructor() {
        this.router = express_1.Router();
        this.setRoutes();
    }
    setRoutes() {
        this.router.get('/', PersonController_1.personController.getAllPersons); //, handleResponse);
        // this.router.get('/:patientId', verifyScope('model:read'), handleGetRequest(resource), patientController.getPatient,
        //                 handleResponse);
        // this.router.post('/', verifyScope('model:write'), handleWriteRequest(resource), patientController.validateLinkedModels,
        //     patientController.createPatient, handleResponse);
        // this.router.put('/:patientId', verifyScope('model:write'), handleWriteRequest(resource), patientController.validateLinkedModels,
        //     patientController.updatePatient, handleResponse);
    }
}
exports.PatientRouter = PatientRouter;
exports.personRouterSingleton = new PatientRouter();
exports.personRouter = exports.personRouterSingleton.router;
