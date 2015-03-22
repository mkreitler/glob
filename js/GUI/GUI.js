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
			widget.unregister();
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

		this.bIsWidget = true;
		this.bActive = true;
		this.bVisible = true;
		this.bMouseDown = false;
		this.data = args.data || null;
		this.onClickedCallback = args.onClickedCallback || null;
		this.parent = args.parent || null;

		// Parent might be a non-widget. In that case, we let the parent
		// manage input, update, and render forwarding.
		if (this.parent) {
			if (this.parent.bIsWidget) {
				this.parent.addChild(this);
			}
			else {
				// Non-widget parent, so we clear the parent field at this point.
				this.parent = null;
			}
		}
		else {
			this.listenForInput();
			this.listenForUpdates();
		}

		this.localX = args.x || 0;
		this.localY = args.y || 0;
		this.globalX = this.parent ? this.localX + parent.globalX : this.localX;
		this.globalY = this.parent ? this.localY + parent.globalY : this.localY;
		this.mouseDelegate = args.mouseDelegate || null;
		this.mouseDownTime = 0;

		this.bounds = new glob.Math.rect2(this.globalX, this.globalY, args.w || 0, args.h || 0);
		this.bWantsDrawBounds = false;
		this.boundsColor = null;
		this.boundsLineWidth = null;

		this.children = [];

		glob.GUI.addWidget(this);
	},

	listenForUpdates: function() {
		glob.Graphics.addListener(this);
		glob.UpdateLoop.addListener(this);
	},

	unlistenForUpdates: function() {
		glob.Graphics.removeListener(this);
		glob.UpdateLoop.removeListener(this);
	},

	listenForInput: function() {
		if (glob.Util.isMobile()) {
			glob.TouchInput.addListener(this);
			glob.Multitouch.addListenr(this);
		}
		else {
			glob.KeyInput.addListener(this);
			glob.MouseInput.addListener(this);
		}
	},

	unlistenForInput: function() {
		if (glob.Util.isMobile()) {
			glob.TouchInput.removeListener(this);
			glob.Multitouch.removeListenr(this);
		}
		else {
			glob.KeyInput.removeListener(this);
			glob.MouseInput.removeListener(this);
		}
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

		this.unlistenForInput();
		this.unlistenForUpdates();

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

	update: function(dt) {
		this.updateChildren(dt);
	},

	updateChildren:function(dt) {
		var iChild = 0;

		for (iChild=0; iChild<this.children.length; ++iChild) {
			this.children[iChild].update(dt);
		}
	},

	draw: function(ctxt) {
		var i = 0;

		if (this.bVisible) {
			// First, draw self.
			this.drawSelf(ctxt);

			// Next, draw children.
			for (i=0; i<this.children.length; ++i) {
				if (this.children[i] && this.children[i].drawSelf) {
					this.children[i].drawSelf(ctxt);
				}
			}

			if (this.bWantsDrawBounds) {
				this.drawBounds(ctxt, this.boundsColor, this.boundsLineWidth);
			}
		}
	},

	showBounds: function(color, lineWidth) {
		this.bWantsDrawBounds = true;
		this.boundsColor = color;
		this.boundsLineWidth = lineWidth;
	},

	hideBounds: function() {
		this.bWantsDrawBounds = false;
	},

	drawBounds: function(ctxt, color, lineWidth) {
		ctxt.beginPath();
		ctxt.strokeStyle = color || glob.Graphics.RED;
		ctxt.lineWidth = lineWidth || 2;
		ctxt.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
		ctxt.closePath();
		ctxt.stroke();
	},

	isTouchingWidget: function(otherWidget) {
		var bTouching = false;

		if (otherWidget && this.bIsVisible && this.bIsActive &&
				otherWidget.isVisible() && otherWidget.isActive()) {
			bTouching = glob.Math.clip(this.bounds, otherWidget.getBounds()) !== null;
		}

		return bTouching;
	},

unregister: function() {
		this.unlistenForInput();
		this.unlistenForUpdates();
	},

	setPos: function(newX, newY) {
		var i=0,
				childBounds = null,
				dx = newX - this.globalX,
				dy = newY - this.globalY;

		this.globalX = newX;
		this.globalY = newY;

		if (this.parent) {
			this.localX = this.globalX - this.parent.globalX;
			this.localY = this.globalY - this.parent.globalY;
		}
		else {
			this.localX = this.globalX;
			this.localY = this.globalY;
		}

		this.bounds.x = newX;
		this.bounds.y = newY;

		for(i=0; i<this.children.length; ++i) {
			childBounds = this.children[i].getBoundsRef();
			childBounds.x += dx;
			childBounds.y += dy;
			this.children[i].globalX += dx;
			this.children[i].globalY += dy;
		}
	},

	updatePos: function(parentX, parentY) {
		this.globalX = parentX + this.localX;
		this.globalY = parentY + this.localY;

		this.bounds.x = this.globalX;
		this.bounds.y = this.globalY;
	},

	getBoundsRef: function() {
		return this.bounds;
	},

	isVisible: function() {
		return this.bVisible;
	},

	isActive: function() {
		return this.bActive;
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

	containsPoint: function(x, y) {
		return Math.rectContainsPoint(this.bounds, x, y);
	},

	onMouseDown: function(x, y) {
		// Override for custom functionality.	
		return false;
	},

	onMouseUp: function(x, y) {
		// Override for custom functionality.
		return false;
	},

	onMouseDrag: function(x, y) {
		return false;
	},

	mouseDrag: function(x, y) {
		var bHandled = false;

		if (this.bVisible && this.bActive) {
			if (glob.GUI.focusWidget === this) {
				if (this.mouseDelegate && this.mouseDelegate.onMouseDrag) {
					bHandled = this.mouseDelegate.onMouseDrag(x, y, this.data);

					if (!bHandled) {
						bHandled = this.onMouseDrag(x, y);
					}
				}
				else {
					bHandled = this.onMouseDrag(x, y);
				}
			}
		}

		return bHandled;
	},

	mouseDown: function(x, y) {
		var bHandled = false,
				iChild = 0,
				child = null;

		glob.GUI.focusWidget = null;

		if (this.bVisible && this.bActive && glob.Math.rectContainsPoint(this.bounds, x, y)) {
			for (iChild=0; !bHandled && iChild<this.children.length; ++iChild) {
				child = this.children[iChild];

				if (child.bVisible && child.bActive && child.containsPoint(x, y)) {
					bHandled = child.mouseDown(x, y);
				}
			}

			if (!bHandled) {
				if (this.onClickedCallback) {

					if (this.onMouseDownSound) {
						glob.Sound.play(this.onMouseDownSound);
						this.mouseDownTime = Date.now();
					}
					bHandled = true;
				}

				if (this.mouseDelegate && this.mouseDelegate.onMouseDown) {
					glob.GUI.focusWidget = this;
					bHandled = bHandled || this.mouseDelegate.onMouseDown(x, y, this.data);

					if (!bHandled) {
						bHandled = this.onMouseDown(x, y);
					}
				}
				else {
					bHandled = this.onMouseDown(x, y);
				}

				if (bHandled) {
					glob.GUI.focusWidget = this;
				}
			}
		}

		return bHandled;
	},

	mouseUp: function(x, y) {
		var bHandled = false;

		if (glob.GUI.focusWidget === this) {
			if (glob.GUI.focusWidget != null && this === glob.GUI.focusWidget) {
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

					if (!bHandled) {
						bHandled = this.onMouseUp(x, y);
					}
				}
				else {
					bHandled = this.onMouseUp(x, y);
				}
			}

			bHandled = true;
			glob.GUI.focusWidget = null;
		}

		return bHandled;
	}
};
