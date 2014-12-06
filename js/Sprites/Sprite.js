// 2D animated game object, possibly with a collision model. Usually rendered
// as part of a SpriteLayer object (see LayerSprite.js).

glob.SpriteGlob = new glob.NewGlobType(
null,
[
  glob.Physics.kinematicObject,
  glob.Physics.Behaviors.reflectAtEdges,
  {
    init: function(spriteSheet, frameIndex, alignX, alignY, x, y, vx, vy, ax, ay) {
      glob.assert(spriteSheet);

      this.initKinematics(x, y, vx, vy, ax, ay);
      this.initReflectBehavior();

      this.spriteSheet = spriteSheet;
      this.frameIndex = frameIndex || 0;
      this.align = {x: alignX || 0, y: alignY || 0};
      this.bounds = new glob.Math.rect2(0, 0, this.spriteSheet.getCellWidth(), this.spriteSheet.getCellHeight());
      this.zOrder = 0;

      this.updateBounds();
    },

    setZOrder: function(zOrder) {
      this.zOrder = zOrder;
    },

    getZOrder: function() {
      return this.zOrder;
    },

    setAlignment: function(alignX, alignY) {
      glob.assert(this.spriteSheet);
      this.spriteSheet.setAlignment(alignX, alignY);
    },

    setFrame: function(index) {
      this.frameIndex = index;
    },

    draw: function(gfx) {
      glob.assert(this.spriteSheet);

      this.spriteSheet.drawRegion(gfx, this.pos.x, this.pos.y, this.frameIndex, this.align.x, this.align.y);
    },

    drawToWorld: function(gfx, worldX, worldY) {
      glob.assert(this.spriteSheet);

      this.spriteSheet.draw(gfx, this.pos.x - worldX, this.pos.y - worldY, this.frameIndex);
    },

    update: function(dt, gameTime) {
      this.updateBounds();

      if (this.checkBounds()) {
        this.updatePosFromBounds();
      }
    },

    setPos: function(x, y) {
      this.pos.x = x;
      this.pos.y = y;

      this.updateBounds(x, y);
    },

    updateBounds: function() {
      this.bounds.x = this.pos.x - this.align.x * this.bounds.w;
      this.bounds.y = this.pos.y - this.align.y * this.bounds.h;
    },

    updatePosFromBounds: function() {
      this.pos.x = this.bounds.x + this.bounds.w * this.align.x;
      this.pos.y = this.bounds.y + this.bounds.h * this.align.y;
    }
  }
]);

