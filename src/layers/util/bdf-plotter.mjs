
export default class BdfPlotter {
  constructor(bdfFile) {
    let {header, properties, glyphs} = this.parseRaw(bdfFile.split('\n'))
    this.glyphs = {};
    this.bitmasks = [
      0b10000000,
      0b01000000,
      0b00100000,
      0b00010000,
      0b00001000,
      0b00000100,
      0b00000010,
      0b00000001
    ];

    this.parseHeaders(header);
    this.parseProperties(properties);
    this.parseGlyphs(glyphs);
  }

  *plotString(string, xPos, yPos) {
    let curser = 0;
    for(const char of Array.from(string)) {
      for(const {x, y} of this.plotGlyph(this.glyphs[char])) {
        yield {x: x + curser + xPos, y: y + yPos - this.fontAscent};
      }
      curser += this.glyphs[char].bb.width;
    }
  }

  *plotGlyph(glyph) {
    for(const [y, buf] of this.createBufferViews(glyph).entries()) {
      for(let i = 0; i < glyph.bb.width; i++) {
        for(const [x, mask] of this.bitmasks.entries()) {
          if(buf[i] & mask)
            yield {x: x + (i*8) + glyph.bb.x, y: y - glyph.bb.y};
        }
      }
    }
  }

  createBufferViews(glyph) {
    let views = [];
    for(let i = 0; i < glyph.bb.height; i++) {
      views.push(new Uint8Array(glyph.buffer, i * glyph.byteWidth, glyph.byteWidth))
    }
    return views;
  }

  stringWidth(string) {
    let width = 0;
    for(const char of Array.from(string)) {
      width += this.glyphs[char].bb.width;
    }

    return width;
  }

  parseRaw(lines) {
    let output = {
      header: [],
      properties: [],
      glyphs: [{header: [], bitmap: []}]
    };
    let state = 'header',
      glyphIndex = 0;
    for(const line of lines) {
      switch(line.split(' ')[0]) {
        case 'CHARS':
          state = 'glyphs';
          continue;
        case 'ENDCHAR':
          glyphIndex++;
          state = 'glyphs';
          output.glyphs.push({header: [], bitmap: []});
          continue;
        case 'BITMAP':
          state = 'bitmap';
          continue;
        case 'STARTPROPERTIES':
          state = 'properties';
        case 'ENDPROPERTIES':
        case 'ENDFONT':
        case 'COMMENT':
          continue;
        default:
          break;
      }

      if(state === 'glyphs')
        output[state][glyphIndex].header.push(line);
      else if(state === 'bitmap')
        output['glyphs'][glyphIndex].bitmap.push(line);
      else
        output[state].push(line);
    }
    return output;
  }

  parseHeaders(lines) {
    for(const line of lines) {
      const cmd = line.split(' ');
      switch(cmd[0]) {
        case 'FONT':
          this.fontName = cmd[1];
          break;
        case 'SIZE':
          this.pointSize = Number(cmd[1]);
          this.xRes = Number(cmd[2]);
          this.yRes = Number(cmd[3]);
          break;
        case 'FONTBOUNDINGBOX':
          this.bb = {
            width: Number(cmd[1]),
            height: Number(cmd[2]),
            x: Number(cmd[3]),
            y: Number(cmd[4])
          };
          break;
        default:
          break;
      }
    }
  }

  parseProperties(lines) {
    for(const line of lines) {
      const cmd = line.split(' ');
      switch(cmd[0]) {
        case 'FONT_ASCENT':
          this.fontAscent = cmd[1];
          break;
        case 'FONT_DESCENT':
          this.fontDescent = cmd[1];
          break;
        default:
          break;
      }
    }
  }

  parseGlyphs(glyphs) {
    for(const rawGlyph of glyphs) {
      let glyph = {
        charCode: 0,
        bb: {
          width: 0,
          height: 0,
          x: 0,
          y: 0
        },
        byteWidth: 0,
        buffer: null
      };
      for(let cmd of rawGlyph.header) {
        cmd = cmd.split(' ');
        switch(cmd[0]) {
          case 'ENCODING':
            glyph.charCode = Number(cmd[1]);
            break;
          case 'BBX':
            glyph.bb.width = Number(cmd[1]);
            glyph.bb.height = Number(cmd[2]);
            glyph.bb.x = Number(cmd[3]);
            glyph.bb.y = Number(cmd[4]);
            glyph.byteWidth = Math.ceil(glyph.bb.width / 8)
            break;
          default:
            break;
        }
      }

      glyph.buffer = new ArrayBuffer(glyph.byteWidth * glyph.bb.height);

      for(const [h, row] of rawGlyph.bitmap.entries()) {
        let view = new Uint8Array(glyph.buffer, h * glyph.byteWidth, glyph.byteWidth);
        for(let i = 0; i < glyph.byteWidth; i++) {
          view[i] = parseInt(row.slice(i * 2, (i * 2) + 2), 16);
        }
      }

      this.glyphs[String.fromCharCode(glyph.charCode)] = glyph;
    }
  }
}
