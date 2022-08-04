import { backend } from './utils/request';

export function userProjectList() {
  return backend.post('/project/userProjectList');
}

export function teamProjectList(data: { teamID: number }) {
  return backend.post('/project/teamProjectList', data);
}

export function recentProjectList() {
  return backend.post('/file/recently');
}

export function trashProjectList() {
  return backend.post('/project/projectUserBinList');
}

export function createProject(data: { projectName: string; teamID: number | null; projectImage: string }) {
  return backend.post('/file/create', data);
}

export function deleteProject(data: { projectID: number }) {
  return backend.post('/project/deleteProject', data);
}

export function recoverProject(data: { projectID: number }) {
  return backend.post('/project/recoverProject', data);
}

export function abandonProject(data: { projectID: number }) {
  return backend.post('/project/abandonProject', data);
}

export function renameProject(data: { projectID: number; newProjectName: string }) {
  return backend.post('/project/renameProject', data);
}

export function projectDetail(data: { projectID: number }) {
  return backend.post('/project/projectDetail', data);
}

export function clearBin() {
  return backend.post('/project/clearBin');
}
