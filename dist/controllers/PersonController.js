"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Person_1 = require("../domain/Person");
const BulkGet_1 = require("../utils/BulkGet");
const PersonService_1 = require("../services/PersonService");
class PersonController {
    async getAllPersons(req, resp, next) {
        BulkGet_1.defaultBulkGet(req, resp, next, Person_1.PersonSchema, Person_1.PersonModel, PersonService_1.personService);
    }
}
exports.PersonController = PersonController;
exports.personController = new PersonController();
