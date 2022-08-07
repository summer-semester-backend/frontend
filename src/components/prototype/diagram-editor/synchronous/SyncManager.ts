import { Message } from 'postcss';
import { DiagramElement } from '../types';

export enum OperationType {
  REGISTER = 'register',
  LEAVE = 'leave',
  ADD_ITEM = 'add_item',
  ADD_PAGE = 'add_page',
  DELETE_ITEM = 'del_item',
  DELETE_PAGE = 'del_page',
  MOVE = 'move',
  MODIFY = 'modify',
}
// handle recevie
export type RegisterFunc = (userID: number, fileID: number) => any;
export type LeaveFunc = (userID: number, fileID: number) => any;
export type AddItemFunc = (userID: number, elements: DiagramElement) => any;
export type MoveFunc = (targetID: string, x: number, y: number) => any;

export class SyncManager {
  registerFuncs: Array<RegisterFunc> = [];
  leaveFuncs: Array<RegisterFunc> = [];
  moveFuncs: Array<MoveFunc> = [];
  addItemFuncs: Array<AddItemFunc> = [];
  websocket: WebSocket;
  constructor(private url: string, private elements: DiagramElement[]) {
    this.url = url;
    this.elements = elements;
    this.websocket = new WebSocket(url);
    this.websocket.onmessage = (ev: MessageEvent<any>) => {
      const message = JSON.parse(ev.data);
      console.log(message);
      switch (message.type) {
        case OperationType.REGISTER:
          this.registerFuncs.forEach((func) => {
            func(message.userID, message.fileID);
          });
        case OperationType.LEAVE:
          this.leaveFuncs.forEach((func) => {
            func(message.userID, message.fileID);
          });
        case OperationType.MOVE:
          this.moveFuncs.forEach((func) => {
            func(message.targetID, message.x, message.y);
          });
      }
    };
  }

  registerResgiterFunc(func: RegisterFunc) {
    this.registerFuncs.push(func);
  }

  registerLeaveFunc(func: LeaveFunc) {
    this.leaveFuncs.push(func);
  }

  registerAddItemFunc(func: AddItemFunc) {
    this.addItemFuncs.push(func);
  }

  registerMoveFunc(func: MoveFunc) {
    this.moveFuncs.push(func);
  }

  registerOpen(userID: number, fileID: number): void {
    this.websocket.onopen = (ev: Event) => {
      this.sendMessage(OperationType.REGISTER, { fileID, userID });
    };
  }

  registerClose(userID: number, fileID: number): void {
    this.websocket.onclose = (ev: Event) => {
      this.sendMessage(OperationType.LEAVE, { fileID, userID });
    };
  }

  sendMessage(type: OperationType, message: object) {
    this.websocket.send(JSON.stringify({ type, ...message }));
  }
}
