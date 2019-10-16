

export enum PayloadOperation {
  'CREATE' = 1,
  'UPDATE' = 2,
  'DELETE' = 3
}


class RabbitMQPublisher {

  // todo
  public publish(orgId: string, correlationId: string, operation: PayloadOperation, message: any){
    console.log(`rabbitMQ message: org=${orgId} op=${operation} correlation=${correlationId} data=${JSON.stringify(message)}`);
  }
}


export const rabbitMQPublisher = new RabbitMQPublisher();