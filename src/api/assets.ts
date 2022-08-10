import { backend } from './utils/request';
export function uploadImage(img: File) {
  let formData = new FormData();
  formData.append('file', img);
  return backend.post('upload', formData);
}
