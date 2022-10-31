import { HaxorMedium } from "../fonts/fonts.mjs";
import PaintLayer from "./paint.mjs"
import BdfPlotter from "./util/bdf-plotter.mjs";

export default class TextLayer extends PaintLayer {
  static name = 'TextLayer';
  static defaultFont = new BdfPlotter(HaxorMedium);
  constructor(options, font = TextLayer.defaultFont) {
    super(options);

    if(!(font instanceof BdfPlotter))
      throw new TypeError('font must be an instance of BdfPlotter');
    this.font = font;
    this._content = this.optionOrDefault('content', options, '');

    this.textAlign = {};
    this.textAlign.h = this.optionOrDefault('textAlignH', options, 'left');
    this.textAlign.v = this.optionOrDefault('textAlignV', options, 'bottom');

    this.renderContent();
  }

  renderContent() {
    this.positionText();
    this.clear();

    for(const {x, y} of this.font.plotString(this._content, this.xOff, this.yOff)) {
      this.drawPoint(x, y);
    }
  }

  positionText() {
    this.positionTextVertical();
    this.positionTextHorizontal();
  }

  positionTextVertical() {
    switch(this.textAlign.v) {
      case 'top':
        this.yOff = this.font.fontAscent;
        break;
      case 'middle':
        this.yOff = Math.round((this.height / 2) - (this.font.bb.height / 2) + (this.font.fontAscent / 2));
        break;
      case 'bottom':
      default:
        this.yOff = this.height - this.font.fontDescent;
        break;
    }
  }

  positionTextHorizontal() {
    switch(this.textAlign.h) {
      case 'right':
        this.xOff = this.width - this.font.stringWidth(this._content);
        break;
      case 'center':
        this.xOff = Math.round((this.width - this.font.stringWidth(this._content)) / 2);
        break;
      case 'left':
      default:
        this.xOff = 0;
        break;
    }
  }

  set content(string) {
    if(typeof string !== 'string') {
      throw new TypeError('content must be a string');
    }
    this._content = string;

    this.renderContent();
  }

  set vAlign(align) {
    this.textAlign.v = align;
    this.renderContent();
  }
  set hAlign(align) {
    this.textAlign.h = align;
    this.renderContent();
  }

  static SetDefaulFont(font) {
    if(!(font instanceof BdfPlotter))
      throw new TypeError('font must be an instance of BdfPlotter');

    TextLayer.defaultFont = font;
  }
}
