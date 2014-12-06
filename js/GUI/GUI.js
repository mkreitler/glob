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
		glob.Utils.fastErase(this.widgets, widget);
	} 
};

glob.GUI.WidgetModule = {
	// Args: parent, x, y, w, h, onClickedCallback, data, onMouseDownSound, onMouseUpSound
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
		this.mouseDownTime = 0;

		this.bounds = new glob.Math.rect2(this.globalX, this.globalY, args.w || 0, args.h || 0);
		glob.MouseInput.addListener(this);

		glob.GUI.addWidget(this);
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

	onMouseDown: function() {
		// Override for custom functionality.	
	},

	onMouseUp: function() {
		// Override for custom functionality.
	},

	mouseDown: function(x, y) {
		var bHandled = false;

		glob.GUI.focusWidget = null;

		if (this.onClickedCallback && glob.Math.rectContainsPoint(this.bounds, x, y)) {
			glob.GUI.focusWidget = this;
			if (this.onMouseDownSound) {
				glob.Sound.play(this.onMouseDownSound);
				this.mouseDownTime = Date.now();
			}
			this.onMouseDown();
			bHandled = true;
		}

		return bHandled;
	},

	mouseUp: function(x, y) {
		var bHandled = false;

		if (glob.GUI.focusWidget === this) {
			bHandled = true;

			if (this.onClickedCallback && glob.Math.rectContainsPoint(this.bounds, x, y)) {
				if (this.onMouseUpSound) {
					if (Date.now() - this.mouseDownTime > glob.GUI.MIN_BUTTON_SND_DELAY) {
						glob.Sound.play(this.onMouseUpSound);
					}
				}
				this.onMouseUp();
				this.onClickedCallback(this.data, this, x, y);
			}

			glob.GUI.focusWidget = null;
		}

		return bHandled;
	}
};
