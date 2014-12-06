// Forwards touch events to registered listeners.
//
// Usage
//  var myListenerObject = {
//  mousePress: function(x, y) { ... },
//  mouseRelease: function(x, y) { ... }
//};
//

glob.MultitouchGlob = new glob.NewGlobType(null,
[
  glob.Listeners,
  {
    init: function() {
      this.pointInfo = {clientX:0, clientY:0, srcElement:null};

      window.addEventListener("touchstart", this.touchStart.bind(this), true);
      window.addEventListener("touchmove", this.touchMove.bind(this), true);
      window.addEventListener("touchend", this.touchEnd.bind(this), true);
    },

    touchStart: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.touches.length; ++i) {
          this.getClientPos(e.touches[i]);
          // console.log("touchDown " + e.touches[i].identifier + " " + this.pointInfo.clientX + " " + this.pointInfo.clientY);
          this.callListenersUntilConsumed("touchDown",
                                                    e.touches[i].identifier,
                                                    this.pointInfo.clientX,
                                                    this.pointInfo.clientY);    
        }
      }
    },
    
    touchMove: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.changedTouches.length; ++i) {
          this.getClientPos(e.changedTouches[i]);
          // console.log("touchMove " + e.changedTouches[i].identifier + " " + this.pointInfo.clientX + " " + this.pointInfo.clientY);
          this.callListenersUntilConsumed("touchMove",
                                                    e.changedTouches[i].identifier,
                                                    this.pointInfo.clientX,
                                                    this.pointInfo.clientY);    
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
      
      this.pointInfo.clientX = x;
      this.pointInfo.clientY = y;
      this.pointInfo.srcElement = document._gameCanvas ? document._gameCanvas : null;
    },
    
    touchEnd: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.changedTouches.length; ++i) {
          this.getClientPos(e.changedTouches[i]);
          // console.log("touchUp " + e.changedTouches[i].identifier + " " + this.pointInfo.clientX + " " + this.pointInfo.clientY);
          this.callListenersUntilConsumed("touchUp",
                                                    e.changedTouches[i].identifier,
                                                    this.pointInfo.clientX,
                                                    this.pointInfo.clientY);    
        }
      }
    }
  }
]);

glob.Multitouch = new glob.MultitouchGlob();

this.touchListener = {
  touchDown: function(id, x, y) { return false; },
  touchMove: function(id, x, y) { return false; },
  touchUp: function(id, x, y) { return false; }
};


