import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { LoginBody, LoginResponse } from './types';

const Login = async (data: LoginBody): Promise<LoginResponse> => {
  return api.post<LoginResponse>('/auth', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

export const AuthService = {
  login: Login,
}
