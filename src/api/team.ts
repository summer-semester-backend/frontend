import { backend } from './utils/request';

export function teamList() {
  return backend.post('team/list');
}

export function createTeam(data: { teamname: string; summary: string }) {
  return backend.post('team/create', data);
}

// return teamname/summary
export function getTeamDetail(data: { teamID: string }) {
  return backend.post('team/detail', data);
}

export function getTeamMember(data: { teamID: string }) {
  return backend.post('team/users', data);
}

export function getTeamList() {
  return backend.post('team/list');
}

export function addTeamManager(data: { teamID: string; userID: number }) {
  return backend.post('team/manager/add', data);
}

export function updateTeamDetail(data: { teamID: string; teamname: string; summary: string }) {
  return backend.post('team/change', data);
}

export function inviteTeamMember(data: { teamID: string }) {
  return backend.post('team/user/invite', data);
}

export function deleteTeamManager(data: { teamID: string; userID: number }) {
  return backend.post('team/manager/delete', data);
}

export function deleteTeamMember(data: { teamID: string; userID: number }) {
  return backend.post('team/user/delete', data);
}

export function deleteTeam(data: { teamID: string }) {
  return backend.post('team/delete', data);
}

export function leaveTeam(data: { teamID: string }) {
  return backend.post('team/leave', data);
}

export function acceptInvitation(data: { inviteCode: string }) {
  return backend.post('team/acceptInvitation', data);
}
