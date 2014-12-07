// Panel class manages a bitmap that may contain child controls.

glob.GUI.Panel = new glob.NewGlobType([
],
[
  glob.Listeners,
  glob.GUI.WidgetModule,

  {
  // Args:
      // {
      //   parent: ,
      //   spriteSheet:,
      //   frameIndex:,
      //   bDraggable:,
      //   x: ,
      //   y: 
      //   mouseDelegate: ,
      //   data:,
      //   onMouseDownSound:,
      //   onMouseUpSound:,
      //  };
    init: function(args) {
      glob.assert(args, "Invalid args passed to GUI.Panel constructor!");
      glob.assert(args.spriteSheet, "Invalid sprite sheet passed to GUI.Panel constructor!"),
      glob.assert(args.frameIndex >= 0 && args.frameIndex < args.spriteSheet.getCellCount(), "Invalid frameIndex sent to GUI.Panel constructor!");

      args.w = args.spriteSheet.getCellWidth();
      args.h = args.spriteSheet.getCellHeight();

      this.initWidget(args);
      this.spriteSheet = args.spriteSheet;
      this.frameIndex = args.frameIndex;
      this.bDraggable = args.bDraggable || false;

      this.mouseDownX = 0;
      this.mouseDownY = 0;
      this.globalXstart = 0;
      this.globalYstart = 0;

      this.bDragging = false;
      // this.debugX = 0;
      // this.debugY = 0;
    },

    onMouseDown: function(x, y) {
      this.mouseDownX = x;
      this.mouseDownY = y;

      this.globalXstart = this.globalX;
      this.globalYstart = this.globalY;

      this.bDragging = false;
    },

    onMouseUp: function(x, y) {
      this.bDragging = false;
    },

    onMouseDrag: function(x, y) {
      var dx = 0,
          dy = 0;

      if (this.bDraggable) {
        this.bDragging = true;
        // this.debugX = x;
        // this.debugY = y;

        dx = x - this.mouseDownX;
        dy = y - this.mouseDownY;

        this.globalX = this.globalXstart + dx;
        this.globalY = this.globalYstart + dy;

        if (this.parent) {
          this.localX = this.globalX - this.parent.globalX;
          this.localY = this.globalY - this.parent.globalY;
        }

        this.bounds.x = this.globalX;
        this.bounds.y = this.globalY;
      }
    },

    drawSelf: function(ctxt) {
      this.spriteSheet.drawRegion(ctxt, this.globalX, this.globalY, this.frameIndex, 0.0, 0.0);

      // DEBUG -- draw drag line.
      // if (this.bDragging) {
      //   ctxt.beginPath();
      //   ctxt.strokeStyle = "#ff0000";
      //   ctxt.lineWidth = 4;
      //   ctxt.moveTo(this.mouseDownX, this.mouseDownY);
      //   ctxt.lineTo(this.debugX, this.debugY);
      //   ctxt.closePath();
      //   ctxt.stroke();
      // }
    },
  }
]);

