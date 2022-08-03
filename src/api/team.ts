import { backend } from './utils/request';

export function teamList() {
  return backend.post('/team/list');
}
