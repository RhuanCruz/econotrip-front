import { User } from "../user/types";

export type LoginBody = {
  login: string;
  password: string;
}

export type LoginResponse = {
  accessToken: string;
  user: User;
}