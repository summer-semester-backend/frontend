import { Message } from 'postcss';
import { ref } from 'vue';
import { DiagramElement } from '../types';

export enum OperationType {
  REGISTER = 'register',
  LEAVE = 'leave',
  ADD_ITEM = 'add_item',
  ADD_PAGE = 'add_page',
  DELETE_ITEM = 'del_item',
  DELETE_PAGE = 'del_page',
  MOVE = 'move',
  RESIZE = 'resize',
  MODIFY = 'modify',
}
// handle recevie
export type RegisterFunc = (userID: number, fileID: number) => any;
export type LeaveFunc = (userID: number, fileID: number) => any;
export type AddItemFunc = (userID: number, elements: DiagramElement) => any;
export type MoveFunc = (targetID: string, x: number, y: number) => any;

export class SyncManager {
  private registerFuncs: Array<RegisterFunc> = [];
  private leaveFuncs: Array<RegisterFunc> = [];
  private moveFuncs: Array<MoveFunc> = [];
  private addItemFuncs: Array<AddItemFunc> = [];
  private websocket: WebSocket;
  constructor(private url: string, private elements: DiagramElement[]) {
    this.url = url;
    this.elements = elements;
    this.websocket = new WebSocket(url);
    this.websocket.onmessage = (ev: MessageEvent<any>) => {
      const message = JSON.parse(ev.data);
      console.log(message);
      switch (message.operation) {
        case 'register':
          console.log(this.registerFuncs.length);
          this.registerFuncs.forEach((func) => {
            func(message.userID, message.fileID);
          });
          break;
        case 'leave':
          this.leaveFuncs.forEach((func) => {
            func(message.userID, message.fileID);
          });
          break;
        case 'move':
          this.moveFuncs.forEach((func) => {
            func(message.targetID, message.x, message.y);
          });
          break;
        case 'resize':
          break;
        default:
          console.log(message.operation);
      }
    };
  }

  registerRegisterFunc(func: RegisterFunc) {
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
      window.$message.info('同步开启');
      this.sendMessage(OperationType.REGISTER, { fileID, userID });
    };
  }

  registerClose(userID: number, fileID: number): void {
    this.websocket.onclose = (ev: Event) => {
      window.$message.info('同步结束');
      this.sendMessage(OperationType.LEAVE, { fileID, userID });
    };
  }

  sendMessage(operation: OperationType, message: object) {
    this.websocket.send(JSON.stringify({ operation, userID, ...message }));
  }
}

let userID: number = parseInt(localStorage.getItem('userID') as string);
let syncManager: SyncManager;
let isSyncManagerInitialized = ref(false);
function createSyncManager(url: string, elements: DiagramElement[]) {
  syncManager = new SyncManager(url, elements);
  console.log('SyncManager created');
  isSyncManagerInitialized.value = true;
}

export { syncManager, createSyncManager, isSyncManagerInitialized };
