glob.SpriteSheetGlob = new glob.NewGlobType({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  init: function(srcImage, rows, cols) {
    this.srcImage = srcImage;
    this.rows = Math.max(1, rows);
    this.cols = Math.max(1, cols);
    this.spriteWidth = this.srcImage.width / this.cols;
    this.spriteHeight = this.srcImage.height / this.rows;
  },

  getCellWidth: function() {
    return this.spriteWidth;
  },

  getCellHeight: function() {
    return this.spriteHeight;
  },

  getCellCount: function() {
    return this.rows * this.cols;
  },

  drawRegion: function(gfx, x, y, frameIndex, alignX, alignY) {
    frameIndex = frameIndex || 0;

    var row = Math.floor(frameIndex / this.cols),
        col = frameIndex % this.cols;

    alignX = alignX || 0;
    alignY = alignY || 0;

    glob.assert(row >= 0 && row < this.rows, "Rows = " + this.rows);
    glob.assert(typeof(col) === 'undefined' || (col >= 0 && col < this.cols));
    glob.assert(gfx);


    gfx.drawImage(this.srcImage, col * this.spriteWidth, row * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                  x - alignX * this.spriteWidth, y - alignY * this.spriteHeight, this.spriteWidth, this.spriteHeight);
  }
});
