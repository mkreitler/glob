// Components /////////////////////////////////////////////////////////////////
glob.GameState = {};

glob.GameState.stateMachine = {
  currentState: null,

  setState: function(newState) {
    if (this.currentState !== newState) {
      if (this.currentState) {
        this.currentState.exit();
        glob.UpdateLoop.removeListener(this.currentState);
        glob.Graphics.removeListener(this.currentState);

        if (glob.util.isMobile()) {
          glob.Multitouch.removeListener(this.currentState);
        }
        else {
          glob.KeyInput.removeListener(this.currentState);
          glob.MouseInput.removeListener(this.currentState);
        }
      }

      if (newState) {
        newState.enter();
        glob.UpdateLoop.addListener(newState);
        glob.Graphics.addListener(newState);

        if (glob.util.isMobile()) {
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

  getState: function() {
    return this.currentState;
  },

  mouseDrag: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseDrag(x, y) : false;
  },

  mouseUp: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseUp(x, y) : false;
  },

  mouseDown: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseDown(x, y) : false;
  },

  mouseOver: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseOver(x, y) : false;
  },

  mouseHold: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseHold(x, y) : false;
  },

  mouseClick: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseClick(x, y) : false;
  },

  mouseDoubleClick: function(x, y) {
    var curState = this.getState();

    return curState ? curState.mouseDoubleClick(x, y) : false;
  },

  mouseOut: function( x, y) {
    var curState = this.getState();

    return curState ? curState.mouseOut(x, y) : false;
  },

  touchUp: function(touchID, x, y) {
    var curState = this.getState();

    return curState ? curState.touchUp(touchID, x, y) : false;
  },

  touchDown: function(touchID, x, y) {
    var curState = this.getState();

    return curState ? curState.touchDown(touchID, x, y) : false
  },

  touchMove: function(touchID, x, y) {
    var curState = this.getState();

    return curState ? curState.touchMove(touchID, x, y) : false;
  },

  keyPress: function(keyCode) {
    var curState = this.getState();

    return curState ? curState.keyPress(keyCode) : false;
  },

  keyRelease: function(keyCode) {
    var curState = this.getState();

    return curState ? curState.keyRelease(keyCode) : false;
  },

  keyHold: function(keyCode) {
    var curState = this.getState();

    return curState ? curState.keyHold(keyCode) : false;
  },

  keyTap: function(keyCode) {
    var curState = this.getState();

    return curState ? curState.keyTap(keyCode) : false;
  },

  keyDoubleTap: function(keyCode) {
    var curState = this.getState();

    return curState ? curState.keyDoubleTap(keyCode) : false;
  }
};

glob.GameState.inputHandlers = {
  mouseDrag: function(x, y) {
    return true;
  },

  mouseUp: function(x, y) {
    return true;
  },

  mouseDown: function(x, y) {
    return true;
  },

  mouseOver: function(x, y) {
    return true;
  },

  mouseHold: function(x, y) {
    return true;
  },

  mouseClick: function(x, y) {
    return true;
  },

  mouseDoubleClick: function(x, y) {
    return true;
  },

  mouseOut: function( x, y) {
    return true;
  },

  touchUp: function(touchID, x, y) {
    return true;
  },

  touchDown: function(touchID, x, y) {
    return true;
  },

  touchMove: function(touchID, x, y) {
    return true;
  },

  keyPress: function(keyCode) {
    return true;
  },

  keyRelease: function(keyCode) {
    return true;
  },

  keyHold: function(keyCode) {
    return true;
  },

  keyTap: function(keyCode) {
    return true;
  },

  keyDoubleTap: function(keyCode) {
    return true;
  }
};