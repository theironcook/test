import { convertData } from '../utils/ResponseConverters';
import { PersonSchema, PersonModel } from '../domain/Person';
import { rabbitMQPublisher, PayloadOperation } from '../utils/RabbitMQPublisher';

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
    const newPerson = await personModel.save();
    
    rabbitMQPublisher.publish(orgId, correlationId, PayloadOperation.CREATE, convertData(PersonSchema, newPerson));

    if(responseFields){
      // This is kind of wasteful to do another query but I can't chain a save with a select      
      return this.findPerson(orgId, newPerson._id, responseFields);
    }
    else {
      return newPerson; // fully populated
    }    
  }

  public async updatePerson(orgId: string, id: string, data: any, correlationId: string, responseFields?: string): Promise<object> {        
    return await PersonModel.findOneAndUpdate({_id: id}, data, {new: true}).find({orgId}).select(responseFields);    
  }

}

export const personService = new PersonService();