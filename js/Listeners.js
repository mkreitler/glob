// [HELP]
// Extend existing joe objects with this module to support the use of listeners.</em>
//
// <strong>Interface</strong>
// addListener(listener, fnCompare)
// removeListener(listener)
// removeAllListeners()
// sortListeners(fnCompare  )
// callListeners(fnName, ...)
// callListenersUntilConsumed(fnName, ...)
//
// Usage:
// var myClass = new glob.NewGlobType(..., [Listeners, ...]);
//
// var myObj = new myClass();
//
// myObj.addListener(l1);
// myObj.addListener(l2);
// myObj.addListener(l3);
// myObj.sortListeners(function(l1, l2) {
//   return l1.getOrder() < l2.getOrder() ? l1 : l2;
// });


glob.Listeners = function() {
  this.listeners = [];
  
  this.addListener = function(theListener, fnCompare) {
    if (theListener) {
      this.listeners.push(theListener);
      if (fnCompare) {
        this.sortListeners(fnCompare);
      }
    }
  };
  
  this.removeListener = function(theListener) {
    glob.util.fastErase(this.listeners, theListener);
  };
 
  this.removeAllListeners = function() {
    this.listeners.length = 0;
  };
  
  this.sortListeners = function(fnCompare) {
    var iInner = 0;
    var iOuter = 0;
    var minIndex = 0;
    var smallest = null;
        
    if (fnCompare && this.listeners.length > 1) {
      minIndex = iOuter;
      
      for (iOuter = 0; iOuter < this.listeners.length - 1; iOuter += 1) {
        for (iInner = iOuter + 1; iInner < this.listeners.length; ++iInner) {
          smallest = fnCompare.apply(this.listeners[minIndex], this.listeners[iInner]);
          
          if (smallest === this.listeners[iInner]) {
            minIndex = iInner;
          }
        }
        
        if (minIndex !== iOuter) {
          this.listeners[minIndex] = this.listeners[iOuter];
          this.listeners[iOuter] = smallest;
        }
      }
    }
  };
  
  this.callListeners = function(fnName) {
    var iListener = 0;
    var args = Array.prototype.slice.call(arguments);
    
    // Remove the function from the arguments list.
    args.shift();
    
    if (fnName) {
      for (iListener = 0; iListener < this.listeners.length; ++iListener) {
        if (this.listeners[iListener][fnName]) {
          this.listeners[iListener][fnName].apply(this.listeners[iListener], (args));
        }
      }
    }
  };
  
  this.callListenersUntilConsumed = function(fnName) {
    var iListener = 0;
    var args = Array.prototype.slice.call(arguments);
    var bConsumed = false;
    
    // Remove the function from the arguments list.
    args.shift();
    
    if (fnName) {
      for (iListener = 0; iListener < this.listeners.length; ++iListener) {
        if (this.listeners[iListener][fnName]) {
          bConsumed = this.listeners[iListener][fnName].apply(this.listeners[iListener], (args));
          
          if (bConsumed) {
            break;
          }
        }
      }
    }
    
    return bConsumed;
  };
};
