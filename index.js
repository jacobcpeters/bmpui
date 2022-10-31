import Screen from "./src/screen.mjs";
import Layer from "./src/layer.mjs";
import PaintLayer from "./src/layers/paint.mjs";
import TextLayer from "./src/layers/text.mjs";
import ButtonLayer from "./src/layers/button.mjs";
import ProgressLayer from "./src/layers/progress.mjs";
import Font from "./src/layers/util/bdf-plotter.mjs"

export { Screen, Layer, PaintLayer, TextLayer, ButtonLayer, ProgressLayer, Font };

export { DefaultTypes }

const DefaultTypes = {
  Layer: Layer,
  PaintLayer: PaintLayer,
  TextLayer: TextLayer,
  ButtonLayer: ButtonLayer,
  ProgressLayer: ProgressLayer
}
