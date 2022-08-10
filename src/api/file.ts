import { backend } from './utils/request';

export function readFile(data: { fileID: number | null; teamID: number | null; shareCode?: string }) {
  return backend.post('/file/read', data);
}

export function readUserFile() {
  return backend.post('/file/all');
}

export function recentProjectList() {
  return backend.post('/file/recently');
}

export function binList(data: { fileID: number | null; teamID: number }) {
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
  fileName?: string | null;
  fileImage?: string | null;
  fatherID?: number | null;
  data?: string | null;
  previewImages?: string[];
}) {
  return backend.post('/file/write', data);
}

export function clearBin(data: { fileID: number | null; teamID: number }) {
  return backend.post('/file/clearBin', data);
}

export function readFileCenter(data: { teamID: number | null; fileID: number | null }) {
  return backend.post('/file/centerRead', data);
}

export function getAncestor(data: { fileID: number | null }) {
  return backend.post('/file/ancestor', data);
}

export function getCommonModule(data: { fileID: number | null }) {
  return backend.post('/file/commonTemplate', data);
}

export function getProtoCommonModule() {
  return backend.post('/file/commonPrototypeTemplate');
}

export function getTeamModule(data: { teamID: number | null; fileID: number | null }) {
  return backend.post('/file/teamTemplate', data);
}

export function createTeamModule(data: { fileName: string | null; fileID: number | null; data: string }) {
  return backend.post('/file/createTemplate', data);
}

export function copyFile(data: {
  fatherID: number | null;
  fileID: number | null;
  teamID: number | null;
  newName: string;
}) {
  return backend.post('/file/copy', data);
}

export function getPrototypeShareCode(data: { fileID: number }) {
  return backend.post('/file/sharePrototype', data);
}

export function closeSharePrototype(data: { fileID: number }) {
  return backend.post('/file/closeSharePrototype', data);
}

export function readModule(data: { fileID: number | null }) {
  return backend.post('/file/commonRead', data);
}

export function projectToTeam(data: { fileID: number | null }) {
  return backend.post('/file/projectToTeam', data);
}
