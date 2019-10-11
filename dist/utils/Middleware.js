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
    const inputFilterParts = inputFilter.split(/(?<!\[[^\]]*),(?![^\[]*\])/);
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
exports.verifyParsedFiltersAllowed = function (modelClass, parsedFilter) {
    console.log('model class ', modelClass.prototype);
    if (modelClass.prototype.allowedFilters) {
        console.log('kewl');
    }
    else {
        console.error('not knewl');
    }
};
exports.convertParsedFilterToQuery = function (modelClass, parsedFilter) {
    const query = parsedFilter.reduce((query, filter) => {
        switch (filter.op) {
            case FilterOperator.EQUALS:
            case FilterOperator.LIKE:
                query = query.find({ [filter.prop]: filter.params });
                break;
            case FilterOperator.NOT_EQUALS:
                query = query.where(filter.prop).ne(filter.params);
                break;
            case FilterOperator.NOT_LIKE: // sadly not like doesn't work yet because .ne can't handle regular expressions
                query = query.where(filter.prop).ne(filter.params);
                break;
            case FilterOperator.GREATER_THAN:
                query = query.where(filter.prop).gt(filter.params);
                break;
            case FilterOperator.GREATER_THAN_EQUAL_TO:
                query = query.where(filter.prop).gte(filter.params);
                break;
            case FilterOperator.LESS_THAN:
                query = query.where(filter.prop).lt(filter.params);
                break;
            case FilterOperator.LESS_THAN_EQUAL_TO:
                query = query.where(filter.prop).lte(filter.params);
                break;
            case FilterOperator.IN:
                query = query.where(filter.prop).in(filter.params);
                break;
        }
        return query;
    }, modelClass.find());
    return query;
};
