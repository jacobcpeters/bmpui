import Layer from "../layer.mjs";
import LinePlotter from "./util/line-plotter.mjs";


export default class PaintLayer extends Layer {
  static name = 'PaintLayer';
  constructor(options) {
    super(options);
  }

  drawPoint(x, y, value = 1) {
    if(this.width > x && this.height > y && x >= 0 && y >= 0)
      this.buffer[(this.width * y) + x] = value;
  }

  drawLine({x = 0, y = 0, length = 1, angle = 0}, value = 1) {
    const plotter = new LinePlotter({x: x, y: y, length: length, angle: angle});
    for(const point of plotter.plot()) {
      this.drawPoint(point.x, point.y, value);
    }
  }

  drawRectEdge({x = 0, y = 0, width = 1, height = 1}, value = 1) {
    this.drawLine({x: x, y: y, length: width}, value);
    this.drawLine({x: x, y: y + height, length: width}, value);
    this.drawLine({x: x, y: y, length: height, angle: 270}, value);
    this.drawLine({x: x + width, y: y, length: width, angle: 270}, value);
  }

  drawRectFill({x = 0, y = 0, width = 1, height = 1}, value = 255) {
    for(let curser = y; curser <= y + height; curser++) {
      this.drawLine({x: x, y: curser, length: width}, value);
    }
  }

  processCmd({type, options = {}, value = 1}) {
    switch(type) {
      case 'point':
        this.drawPoint(options, value);
        break;
      case 'line':
        this.drawLine(options, value);
        break;
      case 'rectEdge':
        this.drawRectEdge(options, value);
        break;
      case 'rectFill':
        this.drawRectFill(options, value);
        break;
      default:
        break;
    }
  }

  set content(cmds) {
    if(!(cmds instanceof Array))
      throw new TypeError('PaintLayer.content requires an Array of commands');

    this.clear();

    for(const cmd of cmds) {
      this.processCmd(cmd);
    }
  }
}
