import { DiagramElement, isConnection, PageItem } from '../types';

import Command from './Command';

export default class DeleteCommand implements Command {
  private deletedConnections: DiagramElement[] = [];

  constructor(private elements: DiagramElement[], private elementToDelete: DiagramElement) {
    this.elementToDelete = { ...elementToDelete };
  }

  do(): void {
    this.deleteElement(this.elementToDelete);
    var fatherPage = this.elements.find((ele) => {
      return (ele.id = this.elementToDelete.fatherID!);
    });
    var index = (fatherPage as PageItem).containedIDs.findIndex(
      (ele) => ele == `[data-item-id='${this.elementToDelete.id}']`
    );
    (fatherPage as PageItem).containedIDs.splice(index, 1);
    // Delete linked connections
    this.deletedConnections = [
      ...this.elements.filter(
        (e) => isConnection(e) && (e.from.item == this.elementToDelete.id || e.to.item == this.elementToDelete.id)
      ),
    ];
    for (let c of this.deletedConnections) this.deleteElement(c);
  }

  undo(): void {
    this.elements.push(this.elementToDelete);

    // Re-add linked connections
    for (let c of this.deletedConnections) this.elements.push(c);
  }

  deleteElement(el: DiagramElement) {
    let idx = this.elements.findIndex((v) => v.id === el.id);
    if (idx !== -1) this.elements.splice(idx, 1);
  }
}
