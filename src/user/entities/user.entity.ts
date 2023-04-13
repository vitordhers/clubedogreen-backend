export class User {
  id?: string;
  Name: string;
  Email: string;
  Password: string;
  recoverPasswordToken: string;
  Cpf: string;
  IsAdmin?: boolean;
  Profiles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
