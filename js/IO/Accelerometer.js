// Singleton that captures acceleromete input for the game.
//
glob.AccelerometerGlob = new glob.NewGlobType(null,
[
  glob.Listeners, {
  // Instance definitions /////////////////////////////////////////////////////
  init: function() {
  	this.isSupported = false;
	window.addEventListener("devicemotion", this.accelChanged.bind(this), true);
  },

  accelChanged: function(e) {
  	if (this.isSupported) {
	    var x = e.acceleration.x;
	    var y = e.acceleration.y;
	    var z = e.acceleration.z;

	    this.callListenersUntilConsumed("accelChanged", x, y, z); 
	}
  },
}]);

glob.Accelerometer = new glob.AccelerometerGlob();

// Support for updates
if (window.DeviceMotionEvent) {
  glob.Accelerometer.isSupported = true;
};

