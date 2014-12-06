// The UpdateLoop drives the update for all objects in the game.
//
// Usage:
// 
// var myObj = {update: function(dt, gameTime) { /* Do stuff here. */ }};
//
// glob.UpdateLoop.addListener(myObj);
// glob.UpdateLoop.start();
//
// Code adapted from "<a href="http://www.hive76.org/fast-javascript-game-loops" target=_blank>Fast Javascript Game Loops</a>," by Sean MacBeth.
// [END HELP]

glob.UpdateLoop = new glob.NewGlobType([
  new glob.Listeners(), {
// Static Definition
  PRIORITY_INPUT: 1000,
  PRIORITY_PROCESS: 100,
  
  SEC_TO_MS: 1000,
  MS_TO_SEC: 0.001,
  TIME_EPSILON: 10, // 10 ms
  
  bWantsUpdate: false,
  timeStep: Math.round(1000 / 60),
  lastTime: 0,
  gameTime: 0,
  elapsedTime: 0,
  interval: null,
  
  setTimeStep: function(newStep) {
    glob.UpdateLoop.timeStep = newStep;
  },
  
  getGameTime: function() {
    return glob.UpdateLoop.gameTime;
  },
  
  update: function() {
    var i;
    var dt;
    var curTime = (new Date).getTime();
    var updateTime;

    if (bWantsUpdate) {
        window.requestAnimFrame()(this.update.bind(this));
    }
    
    glob.UpdateLoop.elapsedTime += (curTime - glob.UpdateLoop.lastTime);
    glob.UpdateLoop.lastTime = curTime;
    
    dt = glob.UpdateLoop.timeStep;
    
    while (glob.UpdateLoop.elapsedTime >= dt) {
      // TODO: calculate gameTime.
      glob.UpdateLoop.gameTime += dt;
    
      // Update. For the sake of performance, we iterate the inherited
      // listener list directly, rather than use callListeners(...)
      for (i = 0; i < glob.UpdateLoop.listeners.length; ++i) {
        glob.UpdateLoop.listeners[i].update(dt * 0.001, dt, glob.UpdateLoop.gameTime);
      }
      
      glob.UpdateLoop.elapsedTime -= dt;
    }
      
    // Compute time to next update, accounting for the amount
    // if time the current update took.
    updateTime = (new Date).getTime() - glob.UpdateLoop.lastTime;
  },
  
  start: function(bOutsideTimer) {
    glob.UpdateLoop.lastTime = (new Date).getTime();
    glob.UpdateLoop.gameTime = 0;

    if (!bOutsideTimer) {
//      glob.UpdateLoop.interval = setInterval(glob.UpdateLoop.update, glob.UpdateLoop.timeStep);
      bWantsUpdate = true;
      this.update();      
    }
  },
  
  stop: function() {
    // clearInterval(glob.UpdateLoop.interval);
    bWantsUpdate = false;
  },
}],
{
// No instance definitions -- UpdateLoop is a singleton.
});

glob.UpdateLoop.start();