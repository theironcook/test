import { Request, Response, NextFunction } from 'express';
import { ResponseWrapper, ResponseCode } from '../utils/Types';
import { PersonSchema, PersonModel } from '../domain/Person';
import { defaultBulkGet } from '../utils/BulkGet';
import { personService } from '../services/PersonService';
import { MissingObjectError } from '../utils/errors';
import { CastError } from 'mongoose';
import { convertData } from '../utils/ResponseConverters';
import * as _ from 'lodash';


export class PersonController {

  public async getAllPersons(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const orgId = (<any>req).orgId;
    defaultBulkGet(orgId, req, resp, next, PersonSchema, PersonModel, personService);
  }

  public async getPerson(req: Request, resp: Response, next: NextFunction): Promise<void> {
    try {      
      const orgId = (<any>req).orgId;
      const response: ResponseWrapper = (resp as any).body;
      const person = await personService.findPerson(orgId, req.params.personId, req.query.responseFields);      
      
      if(_.isArray(person) && person.length === 0){
        next(new MissingObjectError(`Person ${req.params.personId} not found.`));        
      }
      
      response.data = convertData(PersonSchema, person);
      next();       
    }
    catch(err){
      // If req.params.personId wasn't a mongo id then we will get a CastError - basically same as if the id wasn't found
      if(err instanceof CastError){
        next(new MissingObjectError(`Person ${req.params.personId} not found.`));
      }
      else {
        next(err);
      }
    }
  }
  
  // todo - rabbitmq message (need deltas)
  public async createPerson(req: Request, resp: Response, next: NextFunction): Promise<void> {    
    const orgId = (<any>req).orgId;
    const response: ResponseWrapper = resp['body'];
    try {
      const newPerson = await personService.createPerson(orgId, req.body, req['correlationId']);
      response.data = convertData(PersonSchema, newPerson);    
      response.statusCode = ResponseCode.CREATED;
      next();
    } 
    catch (err) {      
      next(err);
    }
  }

  // todo - rabbitmq message (need deltas)
  public async updatePerson(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const orgId = (<any>req).orgId;
    const response: ResponseWrapper = resp['body'];
    try {
      const updatedPerson = await personService.updatePerson(orgId, req.params.personId, req.body, req['correlationId'], req.query.responseFields);

      if(_.isArray(updatedPerson) && updatedPerson.length === 0){
        next(new MissingObjectError(`Person ${req.params.personId} not found.`));        
      }
      
      response.data = convertData(PersonSchema, updatedPerson);      
      response.statusCode = ResponseCode.OK;
      next();
    } 
    catch (err) {      
      next(err);
    }
  }

}

export const personController = new PersonController();