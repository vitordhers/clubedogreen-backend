export class User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  planTime?: string;
  planType: string;
  ip?: string;
  nextPayment?: string;
  recoverPasswordToken?: string;
  cpf: string;
  isAdmin?: boolean;
  profiles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
