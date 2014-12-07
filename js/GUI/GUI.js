// Widgets are the basis of all GUI widgets.
// The most basic widget fires an event when clicked.

glob.GUI = {
	MIN_BUTTON_SND_DELAY: 250,	// ms between button down and button up clicks

	focusWidget: null,
	widgets: [],

	addWidget: function(widget) {
		this.widgets.push(widget);
	},

	removeWidget: function(widget) {
		glob.Utils.erase(this.widgets, widget);
	},

	flushAll: function() {
		var widget = null;

		while (this.widgets.length) {
			widget = this.widgets.pop();
			glob.Graphics.removeListener(widget);
			glob.UpdateLoop.removeListener(widget);
			if (glob.Util.isMobile()) {
				glob.TouchInput.removeListener(widget);
			}
			else {
				glob.KeyInput.removeListener(widget);
				glob.MouseInput.removeListener(widget);
			}
		}		
	} 
};

glob.GUI.WidgetModule = {
	// Args: parent,
	// 			 x,
	//			 y,
	// 			 w,
	// 			 h,
	//			 onClickedCallback,
	// 			 data,
	// 			 onMouseDownSound,
	// 			 onMouseUpSound,
	//			 mouseDelegate

	initWidget: function(args) {
		glob.assert(args, "Invalid args passed to widget!");

		this.bActive = true;
		this.bVisible = true;
		this.bMouseDown = false;
		this.data = args.data || null;
		this.onClickedCallback = args.onClickedCallback || null;
		this.parent = args.parent || null;
		this.localX = args.x || 0;
		this.localY = args.y || 0;
		this.globalX = this.parent ? this.localX + parent.globalX : this.localX;
		this.globalY = this.parent ? this.localY + parent.globalY : this.localY;
		this.mouseDelegate = args.mouseDelegate || null;
		this.mouseDownTime = 0;

		this.bounds = new glob.Math.rect2(this.globalX, this.globalY, args.w || 0, args.h || 0);

		glob.MouseInput.addListener(this);
		glob.Multitouch.addListener(this);
		glob.KeyInput.addListener(this);

		this.children = [];

		glob.GUI.addWidget(this);
	},

	addChild: function(child, bRecomputeGlobalPosition) {
		this.children.push(child);
		child.setParent(this, bRecomputeGlobalPosition);
	},

	removeChild: function(child) {
		glob.Util.erase(this.children, child);
		child.parent = null;
	},

	setParent: function(parent, bInLocalSpace) {
		var dx = 0,
				dy = 0;

		if (parent) {
			if (bInLocalSpace) {
				// Assume this widget is already in local space and
				// update the global coordinates accordingly.
				this.globalX = parent.globalX + this.localX;
				this.globalY = parent.globalY + this.localY;
				this.bounds.x += parent.globalX;
				this.bounds.y += parent.globalY;
			}
			else {
				// Assume this widget is in global space and compute
				// the correct local coordinates.
				this.localX = this.globalX - parent.globalX;
				this.localY = this.globalY - parent.globalY;
			}
		}
	},

	draw: function(ctxt) {
		var i = 0;

		// First, draw self.
		this.drawSelf(ctxt);

		// Next, draw children.
		for (i=0; i<this.children.length; ++i) {
			if (this.children[i] && this.children[i].drawSelf) {
				this.children[i].drawSelf(ctxt);
			}
		}
	},

	drawBounds: function(ctxt, color, lineWidth) {
		ctxt.beginPath();
		ctxt.strokeStyle = color || glob.Graphics.RED;
		ctxt.lineWidth = lineWidth || 2;
		ctxt.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
		ctxt.closePath();
		ctxt.stroke();
	},

	activate: function() {
		this.bActive = true;
		glob.MouseInput.addListener(this);
	},

	deactivate: function() {
		this.bActive = false;
		glob.MouseInput.removeListener(this);
	},

	show: function() {
		this.bVisible = true;
	},

	hide: function() {
		this.bVisible = false;
	},

	onMouseDown: function(x, y) {
		// Override for custom functionality.	
	},

	onMouseUp: function(x, y) {
		// Override for custom functionality.
	},

	onMouseDrag: function(x, y) {

	},

	mouseDrag: function(x, y) {
		var bHandled = false;

		if (this.bVisible && this.bActive) {
			if (glob.GUI.focusWidget === this) {
				this.onMouseDrag(x, y);

				if (this.mouseDelegate && this.mouseDelegate.onMouseDrag) {
					bHandled = this.mouseDelegate.onMouseDrag(x, y, this.data);
				}
			}
		}

		return bHandled;
	},

	mouseDown: function(x, y) {
		var bHandled = false;

		glob.GUI.focusWidget = null;

		if (this.bVisible && this.bActive && glob.Math.rectContainsPoint(this.bounds, x, y)) {
			this.onMouseDown(x, y);

			if (this.onClickedCallback) {
				glob.GUI.focusWidget = this;

				if (this.onMouseDownSound) {
					glob.Sound.play(this.onMouseDownSound);
					this.mouseDownTime = Date.now();
				}
				bHandled = true;
			}

			if (this.mouseDelegate && this.mouseDelegate.onMouseDown) {
				glob.GUI.focusWidget = this;
				bHandled = bHandled || this.mouseDelegate.onMouseDown(x, y, this.data);
			}
		}

		return bHandled;
	},

	mouseUp: function(x, y) {
		var bHandled = false;

		if (glob.GUI.focusWidget === this) {
			bHandled = true;

			if (glob.GUI.focusWidget != null && this === glob.GUI.focusWidget) {
				this.onMouseUp(x, y);

				if (this.onMouseUpSound) {
					if (Date.now() - this.mouseDownTime > glob.GUI.MIN_BUTTON_SND_DELAY) {
						glob.Sound.play(this.onMouseUpSound);
					}
				}

				if (this.onClickedCallback) {
					this.onClickedCallback(this.data, this, x, y);
				}
		
				if (this.mouseDelegate && this.mouseDelegate.onMouseUp) {
					bHandled = bHandled || this.mouseDelegate.onMouseUp(x, y, this.data);
				}
			}

			glob.GUI.focusWidget = null;
		}

		return bHandled;
	}
};
