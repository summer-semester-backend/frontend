import { backend } from './utils/request';

export function readFile(data: { fileID: number | null; teamID: number | null }) {
  return backend.post('/file/read', data);
}

export function readUserFile() {
  return backend.post('/file/all');
}

export function recentProjectList() {
  return backend.post('/file/recently');
}

export function binList(data: { fileID: number | null }) {
  return backend.post('/file/binList', data);
}

export function createFile(data: {
  teamID: number | null;
  fileName: string;
  fileType: number;
  fileImage: string;
  fatherID: number | null;
}) {
  return backend.post('/file/create', data);
}

export function deleteFile(data: { fileID: number }) {
  return backend.post('/file/delete', data);
}

export function recoverFile(data: { fileID: number }) {
  return backend.post('/file/recover', data);
}

export function editFile(data: {
  fileID: number;
  fileName: string | null;
  fileImage: string | null;
  fatherID: number | null;
  data: string | null;
}) {
  return backend.post('/file/write', data);
}

export function clearBin() {
  return backend.post('/file/clearBin');
}
