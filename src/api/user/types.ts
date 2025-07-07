export type User = {
  id: number;
  fullname: string;
  email: string;
  birthdate: string;
  cpf?: string;
};

export type CreateUserBody = {
  email: string;
  fullname: string;
  phone?: string;
  cpf?: string;
  birthdate: string;
  password: string;
};

export type CheckExistenceBody = {
  email: string;
}

export type CheckExistenceResponse= {
  exists: boolean;
}

export type ResetPasswordBody = {
  token: string;
  password: string;
  confirmPassword: string;
}