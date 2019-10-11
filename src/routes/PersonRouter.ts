import { Router } from 'express';
import { personController } from '../controllers/PersonController';

export class PatientRouter {

  public readonly router: Router;

  constructor() {
      this.router = Router();
      this.setRoutes();
  }

  private setRoutes(): void {
      
      this.router.get('/',  personController.getAllPersons);//, handleResponse);
 
      // this.router.get('/:patientId', verifyScope('model:read'), handleGetRequest(resource), patientController.getPatient,
      //                 handleResponse);
      // this.router.post('/', verifyScope('model:write'), handleWriteRequest(resource), patientController.validateLinkedModels,
      //     patientController.createPatient, handleResponse);
      // this.router.put('/:patientId', verifyScope('model:write'), handleWriteRequest(resource), patientController.validateLinkedModels,
      //     patientController.updatePatient, handleResponse);
  }
}

export const personRouterSingleton = new PatientRouter();
export const personRouter = personRouterSingleton.router;


