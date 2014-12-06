// Singleton that captures mouse input for the game.
//
// MouseListener module:
//   mouseDown: function(x, y) {};
//   mouseUp: function(x, y) {};
//   mouseDrag: function(x, y) {};
//   mouseOver: function(x, y) {};
//   mouseClick: function(x, y) {};
//   mouseDoubleClick: function(x, y) {};
//
// myInstance = new myClass();
//
// this.addListener(myInstance);</pre>

glob.MouseInputGlob = new glob.NewGlobType(null,
[
  glob.Listeners, {
  // Static definitions /////////////////////////////////////////////////////
  doubleTapInterval: 200,
  holdInterval: 333,
  mouseState: {x: -1, y:-1, bDown: false, bOff: false, pressTime: 0, pressCount: 0},
  
  setDoubleTapInterval: function(newInterval) {
    this.doubleTapInterval = newInterval;
  },
  
  setHoldInterval: function(newInterval) {
    this.holdInterval = newInterval;
  },
  
  init: function() {
    window.addEventListener("mouseover", this.mouseOver.bind(this), true);
    window.addEventListener("mouseout", this.mouseOut.bind(this), true);
    window.addEventListener("mousedown", this.mouseDown.bind(this), true);
    window.addEventListener("mouseup", this.mouseUp.bind(this), true);
  },
  
  getClientX: function(e) {
    return Math.round((e.srcElement ? e.pageX - e.srcElement.offsetLeft : (e.target ? e.pageX - e.target.offsetLeft : e.pageX)) / glob.Graphics.globalScale);
  },
  
  getClientY: function(e) {
    return Math.round((e.srcElement ? e.pageY - e.srcElement.offsetTop : (e.target ? e.pageY - e.target.offsetTop : e.pageY)) / glob.Graphics.globalScale);
  },
  
  mouseUp: function(e) {
    var x = this.getClientX(e ? e : window.event);
    var y = this.getClientY(e ? e : window.event);
    
    // console.log("Mouse up at ", x, y);
    
    this.mouseState.bDown = false;
    window.removeEventListener("mousemove", this.mouseDrag.bind(this), true);
    
    this.callListenersUntilConsumed("mouseUp", x, y);
    
    (e ? e : event).preventDefault();
  },
  
  mouseDown: function(e) {
    var x = this.getClientX(e ? e : window.event);
    var y = this.getClientY(e ? e : window.event);
    var curTime = glob.UpdateLoop.getGameTime();
    
    // console.log("Mouse down at", x, y);
    
    if (curTime - this.mouseState.pressTime < this.doubleTapInterval) {
        this.mouseDoubleClick(e);
    }
    else {
      this.mouseState.pressCount = 1;
      this.mouseState.pressTime = curTime;
    }
    
    this.mouseState.x = x;
    this.mouseState.y = y;

    this.callListenersUntilConsumed("mouseDown", x, y);    
    this.mouseState.bDown = true;
    
    window.addEventListener("mousemove", this.mouseDrag.bind(this), true);
    
    (e ? e : event).preventDefault();
  },
  
  mouseDrag: function(e) {
    var x = this.getClientX(e ? e : window.event);
    var y = this.getClientY(e ? e : window.event);
    
    this.mouseState.pressTime = 0;
    
    // console.log("Mouse drag at", x, y);

    this.callListenersUntilConsumed("mouseDrag", x, y);    
    
    (e ? e : event).preventDefault();
  },
  
  mouseOver: function(e) {
    // var x = this.getClientX(e ? e : window.event);
    // var y = this.getClientY(e ? e : window.event);
    // console.log("Mouse over at", x, y);
  },
  
  mouseOut: function(e) {
    var x = this.getClientX(e ? e : window.event);
    var y = this.getClientY(e ? e : window.event);
    // console.log("Mouse out at", x, y);
    
    this.mouseState.bDown = false;
    this.mouseState.pressCount = 0;
    window.removeEventListener("mousemove", this.mouseDrag, true);
  },
  
  mouseHold: function() {
    var x = this.mouseState.x;
    var y = this.mouseState.y;
    
    // console.log("Mouse hold at", x, y);
    
    this.callListenersUntilConsumed("mouseHold", x, y);
  },
  
  mouseClick: function() {
    var x = this.mouseState.x;
    var y = this.mouseState.y;
    var i = 0;

    // console.log("Mouse click at", x, y);

    this.callListenersUntilConsumed("mouseClick", x, y);    
  },
  
  mouseDoubleClick: function(e) {
    var x = e ? e.clientX : window.event.clientX;
    var y = e ? e.clientY : window.event.clientY;
    
    this.mouseState.pressTime = 0;
    this.mouseState.pressCount = 0;
    
    // console.log("Mouse double click at", x, y);

    this.callListenersUntilConsumed("mouseDoubleClick", x, y);    
  },

  update: function(dt, gameTime) {    
    if (this.mouseState.bDown && this.mouseState.pressTime > 0) {
      // Check for hold.
      if (gameTime - this.mouseState.pressTime > this.holdInterval) {
          this.mouseState.pressTime = 0;
          this.mouseState.pressCount = 0;
          this.mouseHold();
      }
    }
    else if (this.mouseState.pressTime > 0 && !this.mouseState.bDown) {
      // Check for click.
      if (gameTime - this.mouseState.pressTime > this.doubleTapInterval) {
        this.mouseState.pressTime = 0;
        this.mouseState.pressCount = 0;
        this.mouseClick();
      }
    }
  },
}]);

glob.MouseInput = new glob.MouseInputGlob();

// Support for updates
glob.UpdateLoop.addListener(glob.MouseInput);

this.mouseListener = {
  mouseDown: function(x, y) { return false; },
  mouseUp: function(x, y) { return false; },
  mouseDrag: function(x, y) { return false; },
  mouseOver: function(x, y) { return false; },
  mouseHold: function(x, y) { return false; },
  mouseOut: function(x, y) { return false; },
  mouseClick: function(x, y) { return false; },
  mouseDoubleClick: function(x, y) { return false; }
};


