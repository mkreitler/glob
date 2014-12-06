// Components /////////////////////////////////////////////////////////////////
glob.GameState = {};

glob.GameState.stateMachine = {
  currentState: null,

  setState: function(newState) {
    if (this.currentState !== newState) {
      if (this.currentState) {
        this.currentState ? this.currentState.exit() : null
        glob.UpdateLoop.removeListener(this.currentState);
        glob.Graphics.removeListener(this.currentState);

        if (glob.Util.isMobile()) {
          glob.Multitouch.removeListener(this.currentState);
        }
        else {
          glob.KeyInput.removeListener(this.currentState);
          glob.MouseInput.removeListener(this.currentState);
        }
      }

      if (newState) {
        this.bindAll(newState);

        newState.enter ? newState.enter() : null;

        if (newState.update) {
          glob.UpdateLoop.addListener(newState);
        }
        
        glob.Graphics.addListener(newState);

        if (glob.Util.isMobile()) {
          glob.Multitouch.addListener(newState);
        }
        else {
          glob.KeyInput.addListener(newState);
          glob.MouseInput.addListener(newState);
        }
      }

      this.currentState = newState;
    }
  },

  bindAll: function(newState) {
    var key = null;

    for (key in newState) {
      if (typeof newState[key] === "function") {
        newState[key] = newState[key].bind(this);
      }
    }
  },

  getState: function() {
    return this.currentState;
  },

  mouseDrag: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouseDrag ? curState.mouseDrag(x, y) : false;
  },

  mouseUp: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouseUp ? curState.mouseUp(x, y) : false;
  },

  mouseDown: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouseDown ? curState.mouseDown(x, y) : false;
  },

  mouseOver: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouseOver ? curState.mouseOver(x, y) : false;
  },

  mouseHold: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouuseHold ? curState.mouseHold(x, y) : false;
  },

  mouseClick: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouseClick ? curState.mouseClick(x, y) : false;
  },

  mouseDoubleClick: function(x, y) {
    var curState = this.getState();

    return curState && curState.mouseDoubleClick ? curState.mouseDoubleClick(x, y) : false;
  },

  mouseOut: function( x, y) {
    var curState = this.getState();

    return curState && curState.mouseOut ? curState.mouseOut(x, y) : false;
  },

  touchUp: function(touchID, x, y) {
    var curState = this.getState();

    return curState && curState.touchUp ? curState.touchUp(touchID, x, y) : false;
  },

  touchDown: function(touchID, x, y) {
    var curState = this.getState();

    return curState && curState.touchDown ? curState.touchDown(touchID, x, y) : false
  },

  touchMove: function(touchID, x, y) {
    var curState = this.getState();

    return curState && curState.touchMove ? curState.touchMove(touchID, x, y) : false;
  },

  keyPress: function(keyCode) {
    var curState = this.getState();

    return curState && curState.keyPress ? curState.keyPress(keyCode) : false;
  },

  keyRelease: function(keyCode) {
    var curState = this.getState();

    return curState && curState.keyRelease ? curState.keyRelease(keyCode) : false;
  },

  keyHold: function(keyCode) {
    var curState = this.getState();

    return curState && curState.keyHold ? curState.keyHold(keyCode) : false;
  },

  keyTap: function(keyCode) {
    var curState = this.getState();

    return curState && curState.keyTap ? curState.keyTap(keyCode) : false;
  },

  keyDoubleTap: function(keyCode) {
    var curState = this.getState();

    return curState && curState.keyDoubleTap ? curState.keyDoubleTap(keyCode) : false;
  },

  accelChanged: function(x, y, z) {
    return curState && curState.accelChanged ? curState.accelChanged(x, y, z) : false;
  }
};
