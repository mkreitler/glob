glob.GUI.DEFAULT_LABEL_FONT_SIZE = 20;

glob.GUI.Label = glob.NewGlobType({

},
[
	glob.Listeners,
	glob.GUI.WidgetModule,

	{
		// initWidget: function(parent, x, y, w, h, onClickedCallback, data, onMouseDownSound, onMouseUpSound) {
	
		// Args:
			// { parent: ,
			//   x: ,
			//   y: ,
			//   font: ,
			//   fontSize:,
			//   text:,
			//	 color:,
			//	 inactiveColor:,
			//   onClickedCallback: ,
			//   data:,
			//   onMouseDownSound:,
			//   onMouseUpSound:,
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

			this.color = args.color || glob.Graphics.WHITE;
			this.activeColor = this.color;
			this.inactiveColor = args.inactiveColor || glob.Graphics.DK_GRAY;

			this.hAlign = args.hAlign || 0.5;
			this.vAlign = args.vAlign || 0.5;

			// Compute size of text and label bounds.
			textSize = this.font.measureText(this.text, this.fontSize);
			args.w = textSize.bounds.maxx - textSize.bounds.minx;
			args.h = textSize.bounds.maxy - textSize.bounds.miny;

			args.x = args.x - args.w * this.hAlign;
			args.y = args.y - args.h * this.vAlign;

			this.initWidget(args);

			glob.MouseInput.addListener(this);
			glob.Multitouch.addListener(this);
		},

		draw: function(ctxt) {
			this.font.draw(ctxt, this.text, this.globalX, this.globalY, this.color, this.fontSize, 0, 0);
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

			this.bounds.w = w;
			this.bounds.h = h;
			this.bounds.x = this.bounds.x - this.bounds.w * this.hAlign;
			this.bounds.y = this.bounds.y - this.bounds.h * this.vAlign;
		},

		setText: function(newText) {
			this.text = newText;
			this.updateBounds();
		},
	}
]);