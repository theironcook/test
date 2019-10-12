import { Request, Response, NextFunction } from 'express';
import { ResponseWrapper } from '../utils/Types';
import { PersonSchema, PersonModel } from '../domain/Person';
import { defaultBulkGet } from '../utils/BulkGet';
import { personService } from '../services/PersonService';

export class PersonController {

  public async getAllPersons(req: Request, resp: Response, next: NextFunction): Promise<void> {
    defaultBulkGet(req, resp, next, PersonSchema, PersonModel, personService);
  }

  public async getPerson(req: Request, resp: Response, next: NextFunction): Promise<void> {
    try {
      const response: ResponseWrapper = (resp as any).body;
      response.data = await personService.findPerson(req.params.personId, req.query.responseFields);
      next();
    }
    catch(err){
      next(err);
    }
  }
  
}

export const personController = new PersonController();