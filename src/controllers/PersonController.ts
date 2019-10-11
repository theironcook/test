import { Request, Response, NextFunction } from 'express';
import { PersonSchema, PersonModel } from '../domain/Person';
import { defaultBulkGet } from '../utils/BulkGet';
import { personService } from '../services/PersonService';

export class PersonController {

  public async getAllPersons(req: Request, resp: Response, next: NextFunction): Promise<void> {
    defaultBulkGet(req, resp, next, PersonSchema, PersonModel, personService);
  }
  
}

export const personController = new PersonController();