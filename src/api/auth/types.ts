import { User } from "../user/types";

export type LoginBody = {
  login: string;
  password: string;
}

export type SocialLoginBody = {
  token: string;
}

export type LoginResponse = {
  accessToken: string;
  user: User;
}