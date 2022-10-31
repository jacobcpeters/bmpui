import TextLayer from "./text.mjs";

export default class ButtonLayer extends TextLayer {
  static name = 'ButtonLayer';
  constructor(options, content = 'button', font = TextLayer.defaultFont) {
    super(options, font);
  }

  renderContent() {
    super.renderContent();

    this.drawRectEdge({x: 0, y: 0, width: this.width-1, height: this.height-1});
  }
}
