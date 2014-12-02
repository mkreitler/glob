// Provides a singleton that processes keyboard events for the game.
// Handlers should return 'true' if they want to consume the event.
//
// Usage:
//  KeyListener module:
//   keyPress: function(keyCode) {};
//   keyRelease: function(keyCode) {};
//   keyTap: function(keyCode) {};
//   keyHold: function(keyCode) {};
//   keyDoubleTap: function(keyCode) {};
//
// myInstance = new glob.Class();
//
// glob.KeyInput.addListener(myInstance);</pre>


glob.KeyInput = new glob.NewGlobType([
  new glob.Listeners(), {
  // Static Definitions ////////////////////////////////////////////////////////////
  keyState: [],
  doubleTapInterval: 150,
  holdInterval: 333,
  tapInterval: 150,
  
  setDoubleTapInterval: function(newInterval) {
    glob.KeyInput.doubleTapInterval = newInterval;
  },
  
  setHoldInterval: function(newInterval) {
    glob.KeyInput.holdInterval = newInterval;
  },
  
  setTapInterval: function(newInterval) {
    glob.KeyInput.tapInterval = newInterval;
  },
  
  init: function() {
    var key = null;
    var keyCode;
    var maxCode = -1;
    
    // Get the largest recognized keyCode.
    for (key in glob.KeyInput.KEYS) {
      keyCode = glob.KeyInput.KEYS[key];
      if (keyCode > maxCode) {
        maxCode = keyCode;
      }
    }
    
    // Add keyState trackers for all codes up
    // to the largets (many will be unused).
    while (maxCode >= 0) {
      glob.KeyInput.keyState.push({pressed:false, pressCount: 0, pressTime:-1});
      maxCode -= 1;
    }
  },

  update: function(dt, gameTime) {
    // Iterate through the keyStates.
    // For 'pressed' states, check for 'hold' events.
    // For 'unpressed' states, check for 'tap' events.
    var i;
    var curKeyState;
    
    for (i=0; i<glob.KeyInput.keyState.length; ++i) {
      curKeyState = glob.KeyInput.keyState[i];
      
      if (curKeyState.pressed && curKeyState.pressTime > 0) {
        // Check for hold.
        if (gameTime - curKeyState.pressTime > glob.KeyInput.holdInterval) {
            curKeyState.pressTime = 0;
            glob.KeyInput.keyHold(i);
        }
      }
      else if (curKeyState.pressTime > 0) {
        // Check for tap.
        if (gameTime - curKeyState.pressTime > glob.KeyInput.tapInterval) {
          curKeyState.pressTime = 0;
          glob.KeyInput.keyTap(i);
        }
      }
    }
  },
  
  keyPress: function(e) {
    var localEvent = window.event ? window.event : e;
    var keyCode = ('keyCode' in localEvent) ? localEvent.keyCode : event.charCode;
    var curKeyState = null;
    var curTime = 0;
    var bConsumed = false;
    
    // Update the button state.
    if (typeof(glob.KeyInput.keyState[keyCode]) !== 'undefined') {
      curTime = glob.UpdateLoop.getGameTime();
      
      curKeyState = glob.KeyInput.keyState[keyCode];
      
      if (!curKeyState.pressed) {
        curKeyState.pressed = true;
      
        // Check for double-tap event.
        // Double taps measure time from the first
        // tap.
        if (curTime - curKeyState.pressTime < glob.KeyInput.doubleTapInterval) {
            curKeyState.pressCount = 0;
            curKeyState.pressTime = 0;
            glob.KeyInput.keyDoubleTap(keyCode);
        }
        else {
          curKeyState.pressCount = 1;
          curKeyState.pressTime = curTime;
        }
      }
    }
    
    bConsumed = glob.KeyInput.callListenersUntilConsumed("keyPress", keyCode);
    
    if (bConsumed) {
      localEvent.preventDefault();
    }

    return bConsumed;
  },
  
  keyRelease: function(e) {
    var localEvent = window.event ? window.event : e;
    var keyCode = ('keyCode' in localEvent) ? localEvent.keyCode : event.charCode;
    var curKeyState = null;
    var bConsumed = false;
    
    // Update the button state.
    if (typeof(glob.KeyInput.keyState[keyCode]) !== 'undefined') {
      curKeyState = glob.KeyInput.keyState[keyCode];
      curKeyState.pressed = false;
      curKeyState.pressTime = curKeyState.pressTime > 0 ? glob.UpdateLoop.getGameTime() : 0;
      curKeyState.pressCount = 0;
    }
    
    bConsumed = glob.KeyInput.callListenersUntilConsumed("keyRelease", keyCode);
    
    if (bConsumed) {
      localEvent.preventDefault();
    }

    return bConsumed;
  },
  
  keyTap: function(keyCode) {
    return glob.KeyInput.callListenersUntilConsumed("keyTap", keyCode);
  },
  
  keyHold: function(keyCode) {
    return glob.KeyInput.callListenersUntilConsumed("keyHold", keyCode);
  },
  
  keyDoubleTap: function(keyCode) {
    return glob.KeyInput.callListenersUntilConsumed("keyDoubleTap", keyCode);
  },
  
  // Key codes
  KEYS: {
  BACKSPACE: 8,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  },
}],
{
  // Object Definitions ////////////////////////////////////////////////////////////
});

document.addEventListener("keydown", glob.KeyInput.keyPress, true);
document.addEventListener("keyup", glob.KeyInput.keyRelease, true);

// Support for updates
glob.UpdateLoop.addListener(glob.KeyInput);

glob.KeyInput.keyListener = {
  keyPress: function(key) { return false; },
  keyReleas: function(key) { return false; },
  keyHold: function(key) { return false; },
  keyTap: function(key) { return false; },
  keyDoubleTap: function(key) { return false; }
};
