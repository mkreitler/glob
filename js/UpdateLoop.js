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
  
  SEC_TO_MS: 1000,
  MS_TO_SEC: 0.001,
  TIME_EPSILON: 10, // 10 ms
},
[
  glob.Listeners, {
  
  init: function() {
    this.bWantsUpdate = false;
    this.timeStep = Math.round(1000 / 60);
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

    if (bWantsUpdate) {
        window.requestAnimFrame()(this.update.bind(this));
    }
    
    this.elapsedTime += (curTime - this.lastTime);
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
    // if time the current update took.
    updateTime = (new Date).getTime() - this.lastTime;
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

