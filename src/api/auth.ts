import { backend } from './utils/request';

export function login(data: { email: string; password: string }) {
  return backend.post('auth/login', data);
}

export function applyRegisterCode(data: { email: string }) {
  return backend.post('auth/emailRegister', data);
}

export function register(data: { username: string; email: string; password: string; code: string }) {
  return backend.post('auth/register', data);
}

export function applyForgetCode(data: { email: string }) {
  return backend.post('auth/emailForget', data);
}

export function forgetPassword(data: { email: string; password: string; code: string }) {
  return backend.post('auth/forgetPassword', data);
}

export function changePassword(data: { password: string; newPassword: string }) {
  return backend.post('auth/changePassword', data);
}
