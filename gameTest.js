// Tests the following:
//
// 1) Resource load (bitmap, sound, and font)
// 2) Bitmap display
// 3) Audio playback
// 4) Custom Fonts
// 5) Keyboard IO
// 6) Mouse/Touch IO
// 7) Game states

game = {};


game.TestGame = new glob.NewGlobType([
  // Class Definitions --------------------------------------------------------
  ],
  [
  // Instance Definitions -----------------------------------------------------
    glob.GameState.stateMachine,

    {
      init: function() {
        var width = glob.Graphics.getWidth(),
            height = glob.Graphics.getHeight(),
            self = this;

        // Request some resources.
        this.bmp = glob.Resources.loadImage("res/tile.png");
        this.snd = glob.Resources.loadSound("res/sound.mp3");
        this.mus = glob.Resources.loadSound("res/DST-Aircord.mp3");

        // How many of the resources have loaded?
        this.nResLoaded = 0;

        // ResourceLoad State ---------------------------------------
        this.stateResourceLoad = {
          enter: function() {},
          exit: function() {},

          update: function(dt) {
            this.nResLoaded = glob.Resources.getLoadedCount();
            if (this.nResLoaded === 5) {
              self.setState(self.playState);
            }
          },

          draw: function(ctxt) {
            ctxt.fillStyle = "#000000";
            ctxt.fillRect(0, 0, width, height);
            glob.Graphics.showMessage(ctxt, "Loaded " + this.nResLoaded + " of 5...", "#ff0000", true);
          }
        };

        // Play State -----------------------------------------------
        this.playState = {
          enter: function() {
            // Start the background music loop.
            glob.Sound.loop(self.mus);
          },

          exit: function() {
            // Stop the background music loop.
            glob.Sound.stop(self.mus);
          },

          update: function(dt) {
            // Nothing to do.
          },

          draw: function(ctxt) {
            ctxt.fillStyle = "#000000";
            ctxt.fillRect(0, 0, width, height);
            ctxt.drawImage(self.bmp, 0, 0);
          },

          mouseDown: function(x, y) {
            // Play the 'button down' sound.
            glob.Sound.play(self.snd);

            return true;
          }
        };

        // End States -----------------------------------------------
        this.setState(this.stateResourceLoad);
      }
    },
  ]
);

// Create the game ////////////////////////////////////////////////////////////
var game = new game.TestGame();


