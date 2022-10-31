import PaintLayer from "./paint.mjs"

export default class ProgressLayer extends PaintLayer {
  static name = 'ProgressLayer';
  constructor(options) {
    super(options);

    this.progress = 0;
  }

  render() {
    this.renderBrackets();
    this.renderBar();

    return this.buffer;
  }

  renderBrackets() {
    const bracketWidth = Math.round(this.width * 0.05);
    //Left Bracket
    this.drawRectFill({x: 0, y: 0, width: 2, height: this.height});
    this.drawRectFill({x: 0, y: 0, width: bracketWidth, height: 2});
    this.drawRectFill({x: 0, y: this.height - 3, width: bracketWidth, height: 2});

    //Right Bracket
    this.drawRectFill({x: this.width - 3, y: 0, width: 2, height: this.height});
    this.drawRectFill({x: this.width - 1 - bracketWidth, y: 0, width: bracketWidth, height: 2});
    this.drawRectFill({x: this.width - 1 - bracketWidth, y: this.height - 3, width: bracketWidth, height: 2});
  }

  renderBar() {
    const barHeight = Math.round((this.height - 4) / 2);
    const barWidth = Math.round((this.width - 10) * this.progress);
    const barY = Math.round((this.height / 2) - (barHeight / 2));
    this.drawRectFill({x: 5, y: barY, height: barHeight, width: barWidth});
  }

  addChild() {
    throw new Error('This layer cannot have children');
  }

  set progress(val) {
    this._progress = Math.min(1, Math.max(0, val));
  }
  get progress() {
    return this._progress;
  }
}
