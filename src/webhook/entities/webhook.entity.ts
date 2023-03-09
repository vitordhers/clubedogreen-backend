export class User {
  id?: string;
  Name: string;
  Email: string;
  Password: string;
  Cpf: string;
  IsAdmin?: boolean;
  Profiles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ResponseWebhook {
  statusCode: number;
  message: string;
  error: string;
}