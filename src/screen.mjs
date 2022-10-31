import Layer from "./layer.mjs";

export default class Screen {
  constructor(width, height, rotate = false) {
    this.width = width;
    this.height = height;
    this.scene = new Layer({x:0, y:0, width: width, height: height});

    this.packedWidth = Math.ceil(width / 8);
    this.packedHeight = height;
    this.rotate = rotate;
    if(rotate) {
      this.packedWidth = Math.ceil(height / 8);
      this.packedHeight = width;
    }

    this.activeBuffer = 0;
    this.buffers = [
      new ArrayBuffer(this.packedWidth * this.packedHeight),
      new ArrayBuffer(this.packedWidth * this.packedHeight)
    ];

  }

  swapBuffer() {
    this.activeBuffer ^= 1;
  }

  getBuffer() {
    return this.buffers[this.activeBuffer];
  }

  render() {
    let bufView = new Uint8Array(this.buffers[this.activeBuffer]);
    let renderBuffer = this.scene.render();
    if(this.rotate) {
      for(let y = 0; y < this.packedHeight; y++) {
        for(let x = 0; x < this.packedWidth; x++) {
          bufView[(y * this.packedWidth) + x] = updateByte(y, (x * 8), this.width, renderBuffer);
        }
      }
    }
    else {
      for(let y = 0; y < this.packedHeight; y++) {
        for(let x = 0; x < this.packedWidth; x++) {
          for(let b = 0; b < 8; b++) {
            bufView[(y * this.packedWidth) + x] = updateBit(bufView[(y * this.packedWidth) + x],
                                                              b, !renderBuffer[(y * this.width) + (x * 8) + (7 - b)]);
          }
        }
      }
    }
    return;
  }

}

function updateByte(x, y, width, view) {
  let byte = 0;
  byte |= (view[x + y * width] ? 0 : 1) << 7;
  byte |= (view[x + (y + 1) * width] ? 0 : 1) << 6;
  byte |= (view[x + (y + 2) * width] ? 0 : 1) << 5;
  byte |= (view[x + (y + 3) * width] ? 0 : 1) << 4;
  byte |= (view[x + (y + 4) * width] ? 0 : 1) << 3;
  byte |= (view[x + (y + 5) * width] ? 0 : 1) << 2;
  byte |= (view[x + (y + 6) * width] ? 0 : 1) << 1;
  byte |= (view[x + (y + 7) * width] ? 0 : 1)
  return byte;
}

function updateBit(number, bitPosition, bitValue) {
  const bitValueNormalized = bitValue ? 1 : 0;
  const clearMask = ~(1 << bitPosition);
  return (number & clearMask) | (bitValueNormalized << bitPosition);
}
