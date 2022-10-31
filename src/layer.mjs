

export default class Layer {
  static name = 'Layer';
  constructor({id = '', x = 0, y = 0, width = 0, height = 0}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.buffer = new Uint8ClampedArray(width * height);
    this.parent = null;
    this.children = [];
    this.eventHandlers = [];
  }

  render() {
    for(const child of this.children) {
      const render = child.render();
      for(let x = 0; x < child.width; x++) {
        if(x + child.x >= this.width)
          break;
        for(let y = 0; y < child.height; y++) {
          if(y + child.y >= this.height)
            break;
          const localX = x + child.x;
          const localY = y + child.y;
          this.buffer[(this.width * localY) + localX] = child.buffer[(child.width * y) + x];
        }
      }
    }
    return this.buffer;
  }

  clear() {
    this.buffer.fill(0);
  }

  addChild(child) {
    if(child instanceof Layer) {
      this.children.push(child);
      child.parent = this;
    }
  }

  addEventHandler(type, fn) {
    if(typeof type === 'string' && fn instanceof Function ) {
      this.eventHandlers.push({type: type, fn: fn});
      return true;
    }

    return false;
  }

  trickleEvent(event) {
    if(eventIsUniveral(event) || this.containsPoint(event.x, event.y) ) {
      for(const child of this.children) {
        child.trickleEvent(event);

        if(event.stopPropagation)
          break;
      }

      if(!event.stopPropagation)
        this.handleEvent(event);
    }
  }

  handleEvent(event) {
    for(const handler of this.eventHandlers) {
      if(handler.type === event.type) {
        event.layer = this;
        handler.fn.call(this, event);
      }

      if(event.stopPropagation)
        break;
    }
  }

  containsPoint(x, y) {
    const bb = {x: this.getRealX(), y: this.getRealY()};
    if(inRange(x, bb.x, bb.x + this.width) && inRange(y, bb.y, bb.y + this.height))
      return true;

    return false;
  }

  getLayerById(id) {
    if(id === this.id) {
      return this;
    }
    else {
      for(const child of this.children) {
        let layer = child.getLayerById(id);
        if(layer)
          return layer;
      }
    }
    return null;
  }

  getRealX() {
    if(this.parent === null)
      return this.x;

    return this.x + this.parent.getRealX();
  }

  getRealY() {
    if(this.parent === null)
      return this.y;

    return this.y + this.parent.getRealY();
  }

  optionOrDefault(property, object, defVal) {
    return object.hasOwnProperty(property) ? object[property] : defVal;
  }

  static initScene(scene, layerTypes = {}) {
    let layer;
    if(scene.type in layerTypes)
      layer = new layerTypes[scene.type](scene.options);
    else
      layer = new Layer(scene.options);

    if('children' in scene) {
      for(const child of scene.children)
        layer.addChild(Layer.initScene(child, layerTypes));
    }

    return layer;
  }
}

function eventIsUniveral(event) {
  if(event.x === null || event.y === null)
    return true;

  return false;
}

function inRange(num, min, max) {
  if(num >= min && num <= max)
    return true;

  return false;
}
