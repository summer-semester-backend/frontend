import { ref } from 'vue';
import { DiagramElement } from '../types';

export enum OperationType {
  REGISTER = 'register',
  LEAVE = 'leave',
  ADD_ITEM = 'add_item',
  DELETE_ITEM = 'del_item',
  MOVE = 'move',
  RESIZE = 'resize',
  MODIFY = 'modify',
}
// handle recevie
export type RegisterFunc = (userID: number, fileID: number) => any;
export type LeaveFunc = (userID: number, fileID: number) => any;
export type AddItemFunc = (element: DiagramElement, targetPageID: string) => any;
export type MoveFunc = (targetID: string, x: number, y: number) => any;
export type ResizeFunc = (targetID: string, x: number, y: number, w: number, h: number) => any;
export type ModifyFunc = (element: DiagramElement) => any;
export type DeleteItemFunc = (targetID: string) => any;
export class SyncManager {
  private registerFuncs: Array<RegisterFunc> = [];
  private leaveFuncs: Array<RegisterFunc> = [];
  private moveFuncs: Array<MoveFunc> = [];
  private resizeFuncs: Array<ResizeFunc> = [];
  private modifyFuncs: Array<ModifyFunc> = [];
  private addItemFuncs: Array<AddItemFunc> = [];
  private deleteItemFuncs: Array<DeleteItemFunc> = [];
  private websocket: WebSocket;
  constructor(private url: string, private elements: DiagramElement[]) {
    this.url = url;
    this.elements = elements;
    this.websocket = new WebSocket(url);
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

  registerDeleteItemFunc(func: DeleteItemFunc) {
    this.deleteItemFuncs.push(func);
  }

  registerMoveFunc(func: MoveFunc) {
    this.moveFuncs.push(func);
  }

  registerResizeFunc(func: ResizeFunc) {
    this.resizeFuncs.push(func);
  }

  registerModifyFunc(func: ModifyFunc) {
    this.modifyFuncs.push(func);
  }

  registerOpen(userId: number, fileId: number): void {
    userID = userId;
    fileID = fileId;
    this.websocket.onopen = (ev: Event) => {
      window.$message.info('同步开启');
      this.sendMessage(OperationType.REGISTER, { userID, fileID });
    };
  }

  registerClose(): void {
    this.websocket.onclose = (ev: Event) => {
      window.$message.info('同步结束');
      console.log('关闭socket');
      this.sendMessage(OperationType.LEAVE, { userID, fileID });
    };
  }

  sendMessage(operation: OperationType, message: object) {
    if (this.websocket.readyState < 2) {
      this.websocket.send(JSON.stringify({ operation, ...message }));
    }
  }

  closeWebSocket() {
    this.websocket.close();
  }

  openWebSocket() {
    this.websocket = new WebSocket(this.url);
    this.websocket.onmessage = (ev: MessageEvent<any>) => {
      const message = JSON.parse(ev.data);
      console.log(message.operation, message);
      switch (message.operation) {
        case 'register':
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
          this.resizeFuncs.forEach((func) => {
            func(message.targetID, message.x, message.y, message.w, message.h);
          });
          break;
        case 'modify':
          this.modifyFuncs.forEach((func) => {
            func(message.element);
          });
          break;
        case 'add_item':
          this.addItemFuncs.forEach((func) => {
            func(message.element, message.targetPageID);
          });
          break;
        case 'del_item':
          this.deleteItemFuncs.forEach((func) => {
            func(message.targetID);
          });
          break;
      }
    };
  }
}
let fileID: number;
let userID: number;
let syncManager: SyncManager;
let isSyncManagerInitialized = ref(false);
function createSyncManager(url: string, elements: DiagramElement[]) {
  syncManager = new SyncManager(url, elements);
  console.log('SyncManager created');
  isSyncManagerInitialized.value = true;
}

export { syncManager, createSyncManager, isSyncManagerInitialized };
