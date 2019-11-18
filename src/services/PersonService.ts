import { convertData } from '../utils/ResponseConverters';
import { PersonSchema, PersonModel } from '../domain/Person';
import { rabbitMQPublisher, PayloadOperation } from '../utils/RabbitMQPublisher';

export class PersonService {

  // Some services might need to add additional restrictions to bulk queries
  // This is how they would add more to the base query (Example: fetch only non-deleted users for all queries)
  // public async updateBulkQuery(query): Promise<object> {
  //   // modify query here
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
      // It's is a bit wasteful to do another query but I can't chain a save with a select
      return this.findPerson(orgId, newPerson._id, responseFields);
    }
    else {
      return newPerson; // fully populated model
    }    
  }


  public async updatePerson(orgId: string, id: string, data: any, correlationId: string, responseFields?: string): Promise<object> {
    const updatedPerson = await PersonModel.findOneAndUpdate({_id: id}, data, {new: true}).find({orgId}).select(responseFields);
    
    // The data has the deltas that the rabbit listeners need get.  If there was any calculated data it would need to be placed manually
    // inside of the deltas here.
    const deltas = Object.assign({_id: id}, data);
    rabbitMQPublisher.publish(orgId, correlationId, PayloadOperation.UPDATE, convertData(PersonSchema, deltas));

    return updatedPerson;
  }

  
}

export const personService = new PersonService();