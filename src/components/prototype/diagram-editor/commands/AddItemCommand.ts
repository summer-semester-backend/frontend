import { DiagramElement, Item, PageItem } from '../types';

import Command from './Command';

export default class AddItemCommand implements Command {
  constructor(private elements: DiagramElement[], private elementToAdd: Item, private targetPage: PageItem | null) {
    this.elementToAdd = { ...elementToAdd };
    this.targetPage = targetPage;
  }

  do(): void {
    this.elements.push(this.elementToAdd);
    this.targetPage?.containedIDs.push(`[data-item-id='${this.elementToAdd.id}']`);
    this.elementToAdd.fatherID = this.targetPage?.id;
  }

  undo(): void {
    this.deleteElement(this.elementToAdd);
    this.targetPage?.containedIDs.splice(this.targetPage?.containedIDs.indexOf(this.elementToAdd.id), 1);
  }

  deleteElement(el: DiagramElement) {
    let idx = this.elements.findIndex((v) => v.id === el.id);
    if (idx !== -1) this.elements.splice(idx, 1);
  }
}
