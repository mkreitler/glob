// >Converts touchStart, touchMove, and touchEnd events into mouseDown, mouseMove, and mouseEnd events, respectively.
//
// Usage
//  var myListenerObject = {
//  mousePress: function(x, y) { ... },
//  mouseRelease: function(x, y) { ... }
//};
//

glob.TouchToMouse = new glob.NewGlobType({
  pointInfo: {clientX:0, clientY:0, srcElement:null},
  
  touchStart: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches.length === 1) {
        glob.TouchToMouse.getClientPos(e.touches[0]);
        glob.MouseInput.mouseDown(glob.TouchToMouse.pointInfo);
      }
    }
  },
  
  touchMove: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches.length === 1) {
        glob.TouchToMouse.getClientPos(e.touches[0]);
        glob.MouseInput.mouseDrag(glob.TouchToMouse.pointInfo);
      }
    }
  },
  
  getClientPos: function(touch) {
    // Adapted from gregers' response in StackOverflow:
    // http://stackoverflow.com/questions/5885808/includes-touch-events-clientx-y-scrolling-or-not
    
    var winOffsetX = window.pageXoffset;
    var winOffsetY = window.pageYoffset;
    var x = touch.clientX;
    var y = touch.clientY;
    
    if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
        touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
      x = x - winOffsetX;
      y = y - winOffsetY;
    }
    else if (y < (touch.pageY - winOffsetY) || x < (touch.pageX - winOffsetX)) {
      x = touch.pageX - winOffsetX;
      y = touch.pageY - winOffsetY;
    }
    
    glob.TouchToMouse.pointInfo.clientX = x;
    glob.TouchToMouse.pointInfo.clientY = y;
    glob.TouchToMouse.pointInfo.srcElement = document._gameCanvas ? document._gameCanvas : null;
  },
  
  touchEnd: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    glob.MouseInput.mouseUp(glob.TouchToMouse.pointInfo);
  }
},
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("touchstart", glob.TouchToMouse.touchStart, true);
window.addEventListener("touchmove", glob.TouchToMouse.touchMove, true);
window.addEventListener("touchend", glob.TouchToMouse.touchEnd, true);

