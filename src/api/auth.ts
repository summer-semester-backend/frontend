import { backend } from './utils/request';

export function login(data: { email: string; passwd: string }) {
  return backend.post('auth/login', data);
}

export function getCaptcha(data: { email: string }) {
  return backend.post('auth/captcha', data);
}

export function register(data: { email: string; passwd: string; code: string }) {
  return backend.post('auth/register', data);
}
