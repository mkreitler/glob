// Forwards touch events to registered listeners.
//
// Usage
//  var myListenerObject = {
//  mousePress: function(x, y) { ... },
//  mouseRelease: function(x, y) { ... }
//};
//

glob.Multitouch = new glob.NewGlobType([
  new glob.Listeners(),
  {
    pointInfo: {clientX:0, clientY:0, srcElement:null},
    
    touchStart: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.touches.length; ++i) {
          glob.Multitouch.getClientPos(e.touches[i]);
          // console.log("touchDown " + e.touches[i].identifier + " " + glob.Multitouch.pointInfo.clientX + " " + glob.Multitouch.pointInfo.clientY);
          glob.Multitouch.callListenersUntilConsumed("touchDown",
                                                    e.touches[i].identifier,
                                                    glob.Multitouch.pointInfo.clientX,
                                                    glob.Multitouch.pointInfo.clientY);    
        }
      }
    },
    
    touchMove: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.changedTouches.length; ++i) {
          glob.Multitouch.getClientPos(e.changedTouches[i]);
          // console.log("touchMove " + e.changedTouches[i].identifier + " " + glob.Multitouch.pointInfo.clientX + " " + glob.Multitouch.pointInfo.clientY);
          glob.Multitouch.callListenersUntilConsumed("touchMove",
                                                    e.changedTouches[i].identifier,
                                                    glob.Multitouch.pointInfo.clientX,
                                                    glob.Multitouch.pointInfo.clientY);    
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

      x = Math.round(x / glob.Graphics.globalScale);
      y = Math.round(y / glob.Graphics.globalScale);
      
      glob.Multitouch.pointInfo.clientX = x;
      glob.Multitouch.pointInfo.clientY = y;
      glob.Multitouch.pointInfo.srcElement = document._gameCanvas ? document._gameCanvas : null;
    },
    
    touchEnd: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.changedTouches.length; ++i) {
          glob.Multitouch.getClientPos(e.changedTouches[i]);
          // console.log("touchUp " + e.changedTouches[i].identifier + " " + glob.Multitouch.pointInfo.clientX + " " + glob.Multitouch.pointInfo.clientY);
          glob.Multitouch.callListenersUntilConsumed("touchUp",
                                                    e.changedTouches[i].identifier,
                                                    glob.Multitouch.pointInfo.clientX,
                                                    glob.Multitouch.pointInfo.clientY);    
        }
      }
    }
  }
],
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("touchstart", glob.Multitouch.touchStart, true);
window.addEventListener("touchmove", glob.Multitouch.touchMove, true);
window.addEventListener("touchend", glob.Multitouch.touchEnd, true);

glob.Multitouch.touchListener = {
  touchDown: function(id, x, y) { return false; },
  touchMove: function(id, x, y) { return false; },
  touchUp: function(id, x, y) { return false; }
};


