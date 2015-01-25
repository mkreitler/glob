// The UpdateLoop drives the update for all objects in the game.
//
// Usage:
// 
// var myObj = {update: function(dt, gameTime) { /* Do stuff here. */ }};
//
// this.addListener(myObj);
// this.start();
//
// Code adapted from "<a href="http://www.hive76.org/fast-javascript-game-loops" target=_blank>Fast Javascript Game Loops</a>," by Sean MacBeth.
// [END HELP]

glob.UpdateLoopGlob = new glob.NewGlobType({
  // Static Definition
  PRIORITY_INPUT: 1000,
  PRIORITY_PROCESS: 100,
  MIN_SLEEP_INTERVAL: 10, // MS
  TARGET_FPS: 30,
  
  SEC_TO_MS: 1000,
  MS_TO_SEC: 0.001,
  TIME_EPSILON: 10, // 10 ms
},
[
  glob.Listeners, {
  
  init: function() {
    this.bWantsUpdate = false;
    this.timeStep = Math.round(1000 / glob.UpdateLoopGlob.TARGET_FPS);
    this.lastTime = 0;
    this.gameTime = 0;
    this.elapsedTime = 0;
    this.interval = null;
  },
  
  setTimeStep: function(newStep) {
    this.timeStep = newStep;
  },
  
  getGameTime: function() {
    return this.gameTime;
  },
  
  update: function() {
    var i;
    var dt;
    var curTime = (new Date).getTime();
    var updateTime;
    var updateInterval;
    var waitTime = curTime - this.lastTime;
    
    this.elapsedTime += Math.min(this.timeStep, waitTime);
    this.lastTime = curTime;
    
    dt = this.timeStep;

    while (this.elapsedTime >= dt) {
      // TODO: calculate gameTime.
      this.gameTime += dt;
    
      // Update. For the sake of performance, we iterate the inherited
      // listener list directly, rather than use callListeners(...)
      for (i = 0; i < this.listeners.length; ++i) {
        this.listeners[i].update(dt * 0.001, dt, this.gameTime);
      }
      
      this.elapsedTime -= dt;
    }
      
    // Compute time to next update, accounting for the amount
    // of time the current update took.
    updateTime = (new Date).getTime() - curTime;

    // Schedule the next update.
    if (bWantsUpdate) {
        updateInterval = Math.max(glob.UpdateLoopGlob.MIN_SLEEP_INTERVAL, this.timeStep - updateTime);
        window.setTimeout(this.update.bind(this), updateInterval);
    }
  },
  
  start: function(bOutsideTimer) {
    this.lastTime = (new Date).getTime();
    this.gameTime = 0;

    if (!bOutsideTimer) {
//      this.interval = setInterval(this.update, this.timeStep);
      bWantsUpdate = true;
      this.update();      
    }
  },
  
  stop: function() {
    // clearInterval(this.interval);
    bWantsUpdate = false;
  },
}]);

glob.UpdateLoop = new glob.UpdateLoopGlob();

glob.UpdateLoop.start();

