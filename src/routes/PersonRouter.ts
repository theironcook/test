import { Router } from 'express';
import { personController } from '../controllers/PersonController';

export class PatientRouter {

  public readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/',  personController.getManyPersons);
    this.router.get('/:personId', personController.getPerson);
    this.router.post('/', personController.createPerson);
    this.router.put('/:personId', personController.updatePerson);
  }
}

export const personRouterSingleton = new PatientRouter();
export const personRouter = personRouterSingleton.router;


