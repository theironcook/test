"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
const BulkGet_1 = require("../utils/BulkGet");
// Example of a schema / domain in Mongoose
let PersonSchema = class PersonSchema {
};
// Define which filters are legal for which props
PersonSchema.validFilters = {
    'dog.name': [BulkGet_1.FilterOperator.IN, BulkGet_1.FilterOperator.EQUALS, BulkGet_1.FilterOperator.NOT_EQUALS, BulkGet_1.FilterOperator.LIKE
    ],
    'dog.smell': [BulkGet_1.FilterOperator.LIKE],
    firstName: [BulkGet_1.FilterOperator.IN, BulkGet_1.FilterOperator.LIKE, BulkGet_1.FilterOperator.EQUALS, BulkGet_1.FilterOperator.NOT_EQUALS],
    lastName: [BulkGet_1.FilterOperator.IN, BulkGet_1.FilterOperator.EQUALS, BulkGet_1.FilterOperator.NOT_EQUALS],
    id: [BulkGet_1.FilterOperator.EQUALS, BulkGet_1.FilterOperator.IN]
};
// 2 way map between field values the API client sees and what is stored in the database.  Allows client to use 'id' and database to use '_id'
PersonSchema.propAliases = {
    '_id': 'id',
    'id': '_id'
};
// Converters for values to/from the database.  Converter functions take the entire model
PersonSchema.dataConverters = {
    toDB: {},
    fromDB: {
    // age: (data) => {
    //   return data.age+10;
    // }
    }
};
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], PersonSchema.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], PersonSchema.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], PersonSchema.prototype, "age", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], PersonSchema.prototype, "phone", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], PersonSchema.prototype, "dob", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], PersonSchema.prototype, "dog", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], PersonSchema.prototype, "guitars", void 0);
PersonSchema = __decorate([
    typegoose_1.modelOptions({ schemaOptions: { collection: 'Person' } })
], PersonSchema);
exports.PersonSchema = PersonSchema;
;
exports.PersonModel = typegoose_1.getModelForClass(PersonSchema);
