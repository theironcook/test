import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
import { FilterOperator } from '../utils/BulkGet';


// Example of a schema / domain in Mongoose
@modelOptions({schemaOptions: {collection: 'Person'}})
export class PersonSchema {

  @prop({required: true})
  orgId: string;

  @prop({required: true, minlength: 2}) 
  firstName: string;

  @prop({required: true}) 
  lastName: string;

  @prop() 
  age?: number; 

  @prop() 
  height?: number;

  @prop() 
  phone?: string;

  @prop()
  dob?: string; // todo - a converter function

  @prop()
  dog?: {name?: string, smell?: string};

  @prop()
  guitars?: {name?: string, model?: string, year?: number, locations?: string[]};

  // Define which filters are legal for which props (including nested props (not sure about nested arrays))
  public static readonly validFilters = {
    'dog.name': [FilterOperator.IN, FilterOperator.EQUALS, FilterOperator.NOT_EQUALS, FilterOperator.LIKE
    ],
    'dog.smell': [FilterOperator.LIKE],
    firstName: [FilterOperator.IN, FilterOperator.LIKE, FilterOperator.EQUALS, FilterOperator.NOT_EQUALS],
    lastName: [FilterOperator.IN, FilterOperator.EQUALS, FilterOperator.NOT_EQUALS],
    id: [FilterOperator.EQUALS, FilterOperator.IN]
  };
  
  // 2 way map between field values the API client sees and what is stored in the database.  Allows client to use 'id' and database to use '_id'
  public static readonly propAliases = {
    '_id': 'id',
    'id': '_id'
  };

  // Converters for values to/from the database.  Converter functions take the entire model
  public static readonly dataConverters = {
    // This isn't hooked up yet until needed - if it does, then call this in the controller layer on data before passing to service
    toDB: {
    },

    fromDB: {
      __v: (data) => {
        return undefined; // remove the version field - api users won't see it
      }
    }
  }
};

export const PersonModel = getModelForClass(PersonSchema);