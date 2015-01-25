glob.GUI.DEFAULT_LABEL_FONT_SIZE = 20;

glob.GUI.Label = glob.NewGlobType({

},
[
	glob.Listeners,
	glob.GUI.WidgetModule,

	{
		// Args:
			// { parent: ,
			//   x: ,
			//   y: ,
			//   font: ,
			//   fontSize:,
			//   text:,
			//	 activeColor:,
			//	 inactiveColor:,
			//   selectedColor:,
			//   onClickedCallback: ,
			//   data:,
			//   onMouseDownSound:,
			//   onMouseUpSound:,
			//	 mouseDelegate:,
			//   hAlign:,
			//   vAlign:
			//  };

		init: function(args) {
			var textSize = null;

			glob.assert(args, "Invalid args passed to label!");
			glob.assert(args.font, "Invalid font passed to label!");

			this.font = args.font;
			this.fontSize = args.fontSize;
			this.text = args.text;

			this.activeColor = args.activeColor || glob.Graphics.WHITE;
			this.color = this.activeColor;
			this.inactiveColor = args.inactiveColor || glob.Graphics.DK_GRAY;
			this.selectedColor = args.selectedColor || this.color;

			this.hAlign = args.hAlign || 0.5;
			this.vAlign = args.vAlign || 0.5;

			// Compute size of text and label bounds.
			textSize = this.font.measureText(this.text, this.fontSize);
			args.w = textSize.bounds.maxx - textSize.bounds.minx;
			args.h = textSize.bounds.maxy - textSize.bounds.miny;

			args.x = args.x - args.w * this.hAlign;
			args.y = args.y - args.h * this.vAlign;

			this.initWidget(args);

			args.x = args.x + args.w * this.hAlign;
			args.y = args.y + args.h * this.vAlign;		},

		drawSelf: function(ctxt) {
			this.font.draw(ctxt, this.text, this.globalX, this.globalY, this.color, this.fontSize, 0, 0);

			// Debug: draw bounds
			// ctxt.strokeStyle = "#ff0000";
			// ctxt.beginPath();
			// ctxt.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
			// ctxt.closePath();
			// ctxt.stroke();
		},

		setPos: function(x, y) {
			// TODO: implement this with proper attention to AlignX and AlignY.
			glob.assert(false, "Not yet implemented!");
		},

		onMouseDown: function() {
			if (this.onClickedCallback) {
				this.color = this.selectedColor;
			}
			return true;
		},

		onMouseUp: function() {
			if (this.onClickedCallback) {
				this.color = this.activeColor;
			}
			return true;
		},

		activate: function() {
			this.bActive = true;
			this.color = this.activeColor;
			glob.MouseInput.addListener(this);
		},

		deactivate: function() {
			this.bActive = false;
			this.color = this.inactiveColor;
			glob.MouseInput.removeListener(this);
		},

		updateBounds: function() {
			// Restore original point.
			this.bounds.x += this.bounds.w * this.hAlign;
			this.bounds.y += this.bounds.h * this.vAlign;

			var textSize = this.font.measureText(this.text, this.fontSize),
				w = textSize.bounds.maxx - textSize.bounds.minx,
				h = textSize.bounds.maxy - textSize.bounds.miny;

			this.bounds.w = w || this.bounds.w;	// In case we eliminated all text.
			this.bounds.h = h || this.bounds.h; // In case we eliminated all text.
			this.bounds.x = this.bounds.x - this.bounds.w * this.hAlign;
			this.bounds.y = this.bounds.y - this.bounds.h * this.vAlign;

			this.globalX = this.bounds.x;
			this.globalY = this.bounds.y;

			if (this.parent) {
				this.localX = this.globalX - this.parent.globalX;
				this.localY = this.globalY - this.parent.globalY;
			}
			else {
				this.localX = this.globalX;
				this.localY = this.globalY;
			}
		},

		setText: function(newText) {
			this.text = newText;
			this.updateBounds();
		},
	}
]);