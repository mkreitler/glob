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
// glob.MouseInput.addListener(myInstance);</pre>

glob.MouseInput = new glob.NewGlobType([
  new glob.Listeners(), {
  // Static definitions /////////////////////////////////////////////////////
  doubleTapInterval: 200,
  holdInterval: 333,
  mouseState: {x: -1, y:-1, bDown: false, bOff: false, pressTime: 0, pressCount: 0},
  
  setDoubleTapInterval: function(newInterval) {
    glob.MouseInput.doubleTapInterval = newInterval;
  },
  
  setHoldInterval: function(newInterval) {
    glob.MouseInput.holdInterval = newInterval;
  },
  
  init: function() {
    // Nothing to do here.
  },
  
  getClientX: function(e) {
    return Math.round((e.srcElement ? e.clientX - e.srcElement.offsetLeft : (e.target ? e.clientX - e.target.offsetLeft : e.clientX)) / glob.Graphics.globalScale);
  },
  
  getClientY: function(e) {
    return Math.round((e.srcElement ? e.clientY - e.srcElement.offsetTop : (e.target ? e.clientY - e.target.offsetTop : e.clientY)) / glob.Graphics.globalScale);
  },
  
  mouseUp: function(e) {
    var x = glob.MouseInput.getClientX(e ? e : window.event);
    var y = glob.MouseInput.getClientY(e ? e : window.event);
    
    // console.log("Mouse up at ", x, y);
    
    glob.MouseInput.mouseState.bDown = false;
    window.removeEventListener("mousemove", glob.MouseInput.mouseDrag, true);
    
    glob.MouseInput.callListenersUntilConsumed("mouseUp", x, y);
    
    (e ? e : event).preventDefault();
  },
  
  mouseDown: function(e) {
    var x = glob.MouseInput.getClientX(e ? e : window.event);
    var y = glob.MouseInput.getClientY(e ? e : window.event);
    var curTime = glob.UpdateLoop.getGameTime();
    
    // console.log("Mouse down at", x, y);
    
    if (curTime - glob.MouseInput.mouseState.pressTime < glob.MouseInput.doubleTapInterval) {
        glob.MouseInput.mouseDoubleClick(e);
    }
    else {
      glob.MouseInput.mouseState.pressCount = 1;
      glob.MouseInput.mouseState.pressTime = curTime;
    }
    
    glob.MouseInput.mouseState.x = x;
    glob.MouseInput.mouseState.y = y;

    glob.MouseInput.callListenersUntilConsumed("mouseDown", x, y);    
    glob.MouseInput.mouseState.bDown = true;
    
    window.addEventListener("mousemove", glob.MouseInput.mouseDrag, true);
    
    (e ? e : event).preventDefault();
  },
  
  mouseDrag: function(e) {
    var x = glob.MouseInput.getClientX(e ? e : window.event);
    var y = glob.MouseInput.getClientY(e ? e : window.event);
    
    glob.MouseInput.mouseState.pressTime = 0;
    
    // console.log("Mouse drag at", x, y);

    glob.MouseInput.callListenersUntilConsumed("mouseDrag", x, y);    
    
    (e ? e : event).preventDefault();
  },
  
  mouseOver: function(e) {
    // var x = glob.MouseInput.getClientX(e ? e : window.event);
    // var y = glob.MouseInput.getClientY(e ? e : window.event);
    // console.log("Mouse over at", x, y);
  },
  
  mouseOut: function(e) {
    var x = glob.MouseInput.getClientX(e ? e : window.event);
    var y = glob.MouseInput.getClientY(e ? e : window.event);
    // console.log("Mouse out at", x, y);
    
    glob.MouseInput.mouseState.bDown = false;
    glob.MouseInput.mouseState.pressCount = 0;
    window.removeEventListener("mousemove", glob.MouseInput.mouseDrag, true);
  },
  
  mouseHold: function() {
    var x = glob.MouseInput.mouseState.x;
    var y = glob.MouseInput.mouseState.y;
    
    // console.log("Mouse hold at", x, y);
    
    glob.MouseInput.callListenersUntilConsumed("mouseHold", x, y);
  },
  
  mouseClick: function() {
    var x = glob.MouseInput.mouseState.x;
    var y = glob.MouseInput.mouseState.y;
    var i = 0;

    // console.log("Mouse click at", x, y);

    glob.MouseInput.callListenersUntilConsumed("mouseClick", x, y);    
  },
  
  mouseDoubleClick: function(e) {
    var x = e ? e.clientX : window.event.clientX;
    var y = e ? e.clientY : window.event.clientY;
    
    glob.MouseInput.mouseState.pressTime = 0;
    glob.MouseInput.mouseState.pressCount = 0;
    
    // console.log("Mouse double click at", x, y);

    glob.MouseInput.callListenersUntilConsumed("mouseDoubleClick", x, y);    
  },

  update: function(dt, gameTime) {    
    if (glob.MouseInput.mouseState.bDown && glob.MouseInput.mouseState.pressTime > 0) {
      // Check for hold.
      if (gameTime - glob.MouseInput.mouseState.pressTime > glob.MouseInput.holdInterval) {
          glob.MouseInput.mouseState.pressTime = 0;
          glob.MouseInput.mouseState.pressCount = 0;
          glob.MouseInput.mouseHold();
      }
    }
    else if (glob.MouseInput.mouseState.pressTime > 0 && !glob.MouseInput.mouseState.bDown) {
      // Check for click.
      if (gameTime - glob.MouseInput.mouseState.pressTime > glob.MouseInput.doubleTapInterval) {
        glob.MouseInput.mouseState.pressTime = 0;
        glob.MouseInput.mouseState.pressCount = 0;
        glob.MouseInput.mouseClick();
      }
    }
  },
}],
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("mouseover", glob.MouseInput.mouseOver, true);
window.addEventListener("mouseout", glob.MouseInput.mouseOut, true);
window.addEventListener("mousedown", glob.MouseInput.mouseDown, true);
window.addEventListener("mouseup", glob.MouseInput.mouseUp, true);

// Support for updates
glob.UpdateLoop.addListener(glob.MouseInput);

glob.MouseInput.mouseListener = {
  mouseDown: function(x, y) { return false; },
  mouseUp: function(x, y) { return false; },
  mouseDrag: function(x, y) { return false; },
  mouseOver: function(x, y) { return false; },
  mouseHold: function(x, y) { return false; },
  mouseOut: function(x, y) { return false; },
  mouseClick: function(x, y) { return false; },
  mouseDoubleClick: function(x, y) { return false; }
};


