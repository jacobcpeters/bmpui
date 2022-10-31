
export default class LinePlotter {
  constructor({x = 0, y = 0, length = 1, angle = 0}) {
    this.x = x;
    this.y = y;
    this.length = length;
    //simple clamp for angle
    this.angle = angle >= 360 ? 0 : angle;

    if(isHorizontal(angle)) {
      if(angle === 180) {
        this.x0 = x - length; this.x1 = x;
      }
      else {
        this.x0 = x; this.x1 = x + length
      }
      this.plot = this.plotLineHoriz;
    }
    else if(isVertical(angle)) {
      if(angle === 270){
        this.y0 = y; this.y1 = y + length;
      }
      else {
        this.y0 = y - length; this.y1 = y;
      }
      this.plot = this.plotLineVert;
    }
    else {
      angle = degToRad(angle);
      let xEnd = Math.round(Math.cos(angle) * length) + x;
      let yEnd = Math.round(Math.sin(angle) * length) + y;

      if(Math.abs(yEnd - y) < Math.abs(xEnd - x)) {
        if(x > xEnd) {
          this.x0 = xEnd; this.x1 = x;
          this.y0 = yEnd; this.y1 = y;
        }
        else {
          this.x0 = x; this.x1 = xEnd;
          this.y0 = y; this.y1 = yEnd;
        }
        this.plot = this.plotLineLow;
      }
      else {
        if(y > yEnd) {
          this.x0 = xEnd; this.x1 = x;
          this.y0 = yEnd; this.y1 = y;
        }
        else {
          this.x0 = x; this.x1 = xEnd;
          this.y0 = y; this.y1 = yEnd;
        }
        this.plot = this.plotLineHigh;
      }
    }
  }

  *plotLineHoriz() {
    for(let x = this.x0; x <= this.x1; x++) {
      yield {x: x, y: this.y};
    }
  }

  *plotLineVert() {
    for(let y = this.y0; y <= this.y1; y++) {
      yield {x: this.x, y: y};
    }
  }

  *plotLineLow() {
    let dx = this.x1 - this.x0,
      dy = this.y1 - this.y0,
      yi = 1;

    if(dy < 0) {
      yi = -1;
      dy = -dy;
    }

    let D = (2 * dy) - dx;
    for(let x = this.x0, y = this.y0; x <= this.x1; x++) {
      yield {x: x, y: y};
      if(D > 0) {
        y = y + yi;
        D = D + (2 * (dy - dx));
      }
      else {
        D = D + (2 * dy);
      }
    }
  }

  *plotLineHigh() {
    let dx = this.x1 - this.x0,
      dy = this.y1 - this.y0,
      xi = 1;

    if(dx < 0) {
      xi = -1;
      dx = -dx;
    }

    let D = (2 * dx) - dy;
    for(let x = this.x0, y = this.y0; y <= this.y1; y++) {
      yield {x: x, y: y};
      if(D > 0) {
        x = x + xi;
        D = D + (2 * (dx - dy));
      }
      else {
        D = D + (2 * dx);
      }
    }
  }
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

function isHorizontal(angle) {
  return (angle % 180 === 0);
}

function isVertical(angle) {
  return (angle % 90 === 0) && !isHorizontal(angle);
}
