// Singleton that captures acceleromete input for the game.
//
glob.Accelerometer = new glob.NewGlobType([
glob.Listeners, {
  // Static definitions /////////////////////////////////////////////////////
  accelChanged: function(e) {
    var x = e.acceleration.x;
    var y = e.acceleration.y;
    var z = e.acceleration.z;

    glob.Accelerometer.callListenersUntilConsumed("accelChanged", x, y, z);    
  },
}],
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("devicemotion", glob.Accelerometer.accelChanged, true);

// Support for updates
if (window.DeviceMotionEvent) {
  glob.Accelerometer.isSupported = true;
};

