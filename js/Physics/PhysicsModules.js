// Contains modules that implement common physics behaviors.
glob.Physics = {};

glob.Physics.kinematicObject = {
  initKinematics: function(x, y, vx, vy, ax, ay) {
    this.pos = new glob.Math.vec2(x || 0, y || 0);
    this.vel = new glob.Math.vec2(vx || 0, vy || 0);
    this.acc = new glob.Math.vec2(ax || 0, ay || 0);
    this.oldPos = new glob.Math.vec2(this.pos.x, this.pos.y);
  },

  update: function(dt) {
    var newVx = this.vel.x + this.acc.x * dt;
    var newVy = this.vel.y + this.acc.y * dt;
    var vAveX = (newVx + this.vel.x) * 0.5;
    var vAveY = (newVy + this.vel.y) * 0.5;
    var newX = this.pos.x + vAveX * dt;
    var newY = this.pos.y + vAveY * dt;

    this.vel.x = newVx;
    this.vel.y = newVy;

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = newX;
    this.pos.y = newY;
  },

  getX: function() {
    return this.pos.x;
  },

  getY: function() {
    return this.pos.y;
  },

  getPosRef: function() {
    return this.pos;
  }
};

glob.Physics.Behaviors = {};

// Assumes the parent glob is a kinematicObject.
glob.Physics.Behaviors.reflectAtEdges = {
  initReflectBehavior: function() {
    var DEFAULT_SIZE = 10;

    this.regionBounds = new glob.Math.rect2(0, 0, glob.Graphics.getWidth(), glob.Graphics.getHeight());

    if (!this.bounds) {
      this.bounds = new glob.Math.rect2(this.getX(), this.getY(), DEFAULT_SIZE, DEFAULT_SIZE);
    }
  },

  setRegionBounds: function(x, y, w, h) {
    this.regionBounds.x = x;
    this.regionBounds.y = y;
    this.regionBounds.w = w;
    this.regionBounds.h = h;
  },
  
  checkBounds: function() {
    var spillover = 0,
        oldVelX = this.vel.x,
        oldVelY = this.vel.y;

    if (this.vel.x > 0) {
      spillover = this.bounds.x + this.bounds.w - (this.regionBounds.x + this.regionBounds.w);
      if (spillover > 0) {
        this.bounds.x = this.regionBounds.x + this.regionBounds.w - spillover - this.bounds.w;
        this.vel.x *= -1;
      }
    }
    else if (this.vel.x < 0) {
      spillover = this.bounds.x - this.regionBounds.x;
      if (spillover < 0) {
        this.bounds.x = this.regionBounds.x - spillover;
        this.vel.x *= -1;
      }
    }

    if (this.vel.y > 0) {
      spillover = this.bounds.y + this.bounds.h - (this.regionBounds.y + this.regionBounds.h);
      if (spillover > 0) {
        this.bounds.y = this.regionBounds.y + this.regionBounds.h - spillover - this.bounds.h;
        this.vel.y *= -1;
      }
    }
    else if (this.vel.y < 0) {
      spillover = this.bounds.y - this.regionBounds.y
      if (spillover < 0) {
        this.bounds.y = this.regionBounds.y - spillover;
        this.vel.y *= -1;
      }
    }

    // Return 'true' if reflected.
    return oldVelX * this.vel.x < 0 || oldVelY * this.vel.y < 0;
  }
};

