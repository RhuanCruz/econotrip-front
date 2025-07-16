import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { CheckExistenceBody, CheckExistenceResponse, CreateUserBody, ResetPasswordBody, UpdateUserBody, User } from './types';

const CreateUser = async (data: CreateUserBody): Promise<User> => {
  return api.post('/users', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

const CheckExistence = async (data: CheckExistenceBody): Promise<CheckExistenceResponse> => {
  return api.post<CheckExistenceResponse>('/users/check', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const ForgotPassword = async (email: string): Promise<void> => {
  await api.post('/users/forgot-password', { email })
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const ResetPassword = async (data: ResetPasswordBody): Promise<void> => {
  return api.post('/users/reset-password', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const UpdateUser = async (token: string, id: number, data: UpdateUserBody): Promise<void> => {
  await api.patch(`/users/${id}`, data, { headers: { Authorization: `Bearer ${token}`}})
    .catch((err) => { throw new Error(handleApiError(err)) });
}

export const UserService = {
  create: CreateUser,
  update: UpdateUser,
  checkExistence: CheckExistence,
  forgotPassword: ForgotPassword,
  resetPassword: ResetPassword,
}
