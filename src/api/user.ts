import { backend } from './utils/request';

export function getUserInfo(data: { userID: string}) {
  return backend.post('user/detail', data);
}

export function updateUserInfo(data: {avatar: string; email: string; nickname: string; phone: string; sex: number; summary: string; username: string;}) {
  return backend.post('user/update', data);
}

export function updateUserAva(data: { avatar: string}) {
  return backend.post('user/update_ava', data);
}

export function searchUser(data: { nameOrEmail: string }) {
  return backend.post('user/search', data);
}
