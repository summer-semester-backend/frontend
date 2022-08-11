export interface IZoomManager {
  zoomReset(): number;
  zoomSet(factor: number): number;
  zoomIn(): number;
  zoomOut(): number;
  getZoomFactor(): number;
}

export class DefaultZoomManager implements IZoomManager {
  private zooms = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200, 300, 400, 500]; // must contain the value 100
  private defaultZoomIndex = this.zooms.findIndex((v) => v === 100);
  private zoomIndex = this.defaultZoomIndex;

  zoomReset(): number {
    this.zoomIndex = this.defaultZoomIndex;
    return this.getZoomFactor();
  }
  zoomSet(factor: number): number {
    for (var i = 0; i < this.zooms.length; i++) {
      if (this.zooms[i] < factor) {
        this.zoomIndex = i;
      }
    }
    return this.getZoomFactor();
  }
  zoomIn(): number {
    if (this.zoomIndex < this.zooms.length - 1) this.zoomIndex++;
    return this.getZoomFactor();
  }
  zoomOut(): number {
    if (this.zoomIndex > 0) this.zoomIndex--;
    return this.getZoomFactor();
  }

  getZoomFactor(): number {
    return this.zooms[this.zoomIndex] / 100;
  }
}
