"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BulkGet_1 = require("../utils/BulkGet");
class BaseController {
    async defaultBulkGet(req, resp, next, schemaClass, modelClass, service) {
        try {
            const countQuery = BulkGet_1.createCountQuery(schemaClass, modelClass, req.query);
            const query = BulkGet_1.createQuery(schemaClass, modelClass, req.query);
            if (service.updateBulkQuery) {
                service.updateBulkQuery(countQuery);
                service.updateBulkQuery(query);
            }
            const { data, meta } = await BulkGet_1.defaultBulkGetHandler(countQuery, query);
            //next();
            resp.status(200).send({ data, meta });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BaseController = BaseController;
