import { PersonModel } from '../domain/Person';
import { response } from 'express';

export class PersonService {

  // If the service needs to add more to the query - like always exclude persons marked as deleted or private persons etc
  // The default BulkGet.defaultBulkGet would invoke this function to modify the query and countQuery accordingly
  // public async updateBulkQuery(query): Promise<object> {
  //   return query;
  // }

  public async findPerson(orgId: string, personId: string, responseFields?: string){
    return PersonModel.findById(personId).find({orgId}).select(responseFields);
  }


  public async createPerson(orgId: string, data: any, correlationId: string, responseFields?: string): Promise<object> {
    data.orgId = orgId;
    const personModel = new PersonModel(data);
    return await personModel.save();// todo .select(responseFields);    
  }

  public async updatePerson(orgId: string, id: string, data: any, correlationId: string, responseFields?: string): Promise<object> {        
    return await PersonModel.findOneAndUpdate({_id: id}, data, {new: true}).find({orgId}).select(responseFields);    
  }

}

export const personService = new PersonService();