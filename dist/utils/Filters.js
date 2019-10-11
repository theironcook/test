"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["LIKE"] = "~=";
    FilterOperator["NOT_LIKE"] = "<>=";
    FilterOperator["EQUALS"] = "==";
    FilterOperator["NOT_EQUALS"] = "!=";
    FilterOperator["IN"] = "->";
    FilterOperator["GREATER_THAN_EQUAL_TO"] = ">=";
    FilterOperator["GREATER_THAN"] = ">";
    FilterOperator["LESS_THAN"] = "<";
    FilterOperator["LESS_THAN_EQUAL_TO"] = "<=";
})(FilterOperator = exports.FilterOperator || (exports.FilterOperator = {}));
;
// convert filter string into parsed filter objects with prop, op and params
// throws on any suspicous / wrong input it can recognize
exports.parseFilter = function (inputFilter) {
    const parsedFilter = [];
    const inputFilterParts = inputFilter.split(/(?<!\[[^\]]*),(?![^\[]*\])/).filter(part => part.trim()); // remove blank entries  
    for (let filterPart of inputFilterParts) {
        const parts = filterPart.split(/([\w\.]+)+([=!~<>\-\s]+)+(.*)/);
        if (parts.length < 4) {
            throw `The input filter "${inputFilter}" had a part that didn't appear to be well formed "${filterPart}"`;
        }
        const prop = parts[1].trim();
        const op = parts[2].trim();
        let params = parts[3].trim();
        switch (op) {
            case FilterOperator.EQUALS:
            case FilterOperator.NOT_EQUALS:
                // nothing to do but it's a known operator
                break;
            case FilterOperator.LESS_THAN:
            case FilterOperator.GREATER_THAN:
            case FilterOperator.LESS_THAN_EQUAL_TO:
            case FilterOperator.GREATER_THAN_EQUAL_TO:
                params = Number(params);
                if (isNaN(params)) {
                    throw `The input filter "${inputFilter}" had a ${op} operator that didn't have a valid number "${filterPart}"`;
                }
                break;
            case FilterOperator.LIKE:
            case FilterOperator.NOT_LIKE:
                params = new RegExp(params.trim(), 'i');
                break;
            case FilterOperator.IN:
                try {
                    // The value should be a simple array so it should be easily parsed as JSON
                    params = JSON.parse(params);
                }
                catch (e) {
                    throw `The input filter "${inputFilter}" had a -> filter didn't appear to be well formed "${filterPart}"`;
                }
                break;
            default:
                throw `The input filter "${inputFilter}" contained an unknown operator "${op}"`;
        }
        parsedFilter.push({ prop, op, params });
    }
    return parsedFilter;
};
exports.verifyParsedFiltersAllowed = function (schemaClass, parsedFilter) {
    if (schemaClass.validFilters) {
        for (let filter of parsedFilter) {
            if (!schemaClass.validFilters[filter.prop]) {
                throw `Filter prop ${filter.prop} is not allowed for domain.`;
            }
            else if (schemaClass.validFilters[filter.prop].indexOf(filter.op) === -1) {
                throw `Filter prop ${filter.prop} can't handle the operator ${filter.op}.`;
            }
        }
    }
    else {
        return true; // there was no filter which is OK
    }
};
// Database stores _id but queries are done by id
exports.convertPropAlias = function (schemaClass, prop) {
    if (schemaClass.propAliases && schemaClass.propAliases[prop]) {
        return schemaClass.propAliases[prop];
    }
    else {
        return prop;
    }
};
// Take a schema / model and a parsed filter and return a mongo query
exports.convertParsedFilterToQuery = function (schemaClass, modelClass, parsedFilter) {
    const query = parsedFilter.reduce((query, filter) => {
        const propAlias = exports.convertPropAlias(schemaClass, filter.prop);
        switch (filter.op) {
            case FilterOperator.EQUALS:
            case FilterOperator.LIKE:
                query = query.find({ [propAlias]: filter.params });
                break;
            case FilterOperator.NOT_EQUALS:
                query = query.where(propAlias).ne(filter.params);
                break;
            case FilterOperator.NOT_LIKE: // sadly NOT_LIKE doesn't work yet because .ne can't handle regular expressions
                query = query.where(propAlias).ne(filter.params);
                break;
            case FilterOperator.GREATER_THAN:
                query = query.where(propAlias).gt(filter.params);
                break;
            case FilterOperator.GREATER_THAN_EQUAL_TO:
                query = query.where(propAlias).gte(filter.params);
                break;
            case FilterOperator.LESS_THAN:
                query = query.where(propAlias).lt(filter.params);
                break;
            case FilterOperator.LESS_THAN_EQUAL_TO:
                query = query.where(propAlias).lte(filter.params);
                break;
            case FilterOperator.IN:
                query = query.where(propAlias).in(filter.params);
                break;
        }
        return query;
    }, modelClass.find());
    return query;
};
exports.createQuery = function (schemaClass, modelClass, { filter = '', limit = 10, lastId, responseFields }) {
    let query;
    console.log('filterr is ', filter);
    if (filter.trim()) {
        const parsedFilter = exports.parseFilter(filter);
        exports.verifyParsedFiltersAllowed(schemaClass, parsedFilter);
        query = exports.convertParsedFilterToQuery(schemaClass, modelClass, parsedFilter);
    }
    else {
        query = modelClass.find();
    }
    if (lastId) {
        query.where('_id').gt(lastId);
    }
    // todo - every query should inject an org id into the where statement
    // get the org id from a simple request parameter passed as a required parameter to this function
    // query.where('orgId').eq('123');
    query.limit(limit);
    if (responseFields) {
        query.select(responseFields);
    }
    return query;
};
exports.createCountQuery = function (schemaClass, modelClass, { filter = '', lastId }) {
    return exports.createQuery(schemaClass, modelClass, { filter, limit: null, lastId, responseFields: '_id' });
};
// export const extractQueryOptions = function(req: Request): QueryOptions{
//   const queryParams: QueryOptions = {};
//   if(req.params.filter){
//     queryParams.filter = req.params.filter;
//   }
//   if(req.params.lastId){
//     queryParams.filter = req.params.filter;
//   }
//   return queryParams;
// }
