import { PersonModel } from '../domain/Person';

export class PersonService {

  // If the service needs to add more to the query - like always exclude persons marked as deleted or private persons etc
  // The default BulkGet.defaultBulkGet would invoke this function to modify the query and countQuery accordingly
  // public async updateBulkQuery(query): Promise<object> {
  //   return query;
  // }

  public async findPerson(personId: string, responseFields?: string){
    return PersonModel.findById(personId).select(responseFields);
  }

}

export const personService = new PersonService();