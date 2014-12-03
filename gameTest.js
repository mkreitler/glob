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
        // Request some resources.
        this.bmp = glob.Resources.loadImage("res/tile.png");
        this.snd = glob.Resources.loadSound("res/sound.mp3");
        this.mus = glob.Resources.loadSound("res/DST-Aircord.mp3");
        this.fnt = glob.Resources.loadFont("res/AstronBoyWonder.ttf", "Astron");

        // How many of the resources have loaded?
        this.nResLoaded = 0;

        // End States -----------------------------------------------
        this.setState(this.stateResourceLoad);
      },

      // ResourceLoad State ---------------------------------------
      stateResourceLoad: {
        enter: function() {},
        exit: function() {},

        update: function(dt) {
          this.nResLoaded = glob.Resources.getLoadedCount();
          if (glob.Resources.getLoadProgress() > 1 - glob.math.EPSILON) {
            this.setState(this.playState);
          }
        },

        draw: function(ctxt) {
          var width = glob.Graphics.getWidth(),
              height = glob.Graphics.getHeight();

          ctxt.fillStyle = "#000000";
          ctxt.fillRect(0, 0, width, height);
          glob.Graphics.showMessage(ctxt, "Loaded " + this.nResLoaded + " of 4...", "#ff0000", true);
        }
      },

      // Play State -----------------------------------------------
      playState: {
        enter: function() {
          // Start the background music loop.
          glob.Sound.loop(this.mus);
        },

        exit: function() {
          // Stop the background music loop.
          glob.Sound.stop(this.mus);
        },

        update: function(dt) {
          // Nothing to do.
        },

        draw: function(ctxt) {
          var iRow = 0,
              iCol = 0,
              modVal = 0,
              width = glob.Graphics.getWidth(),
              height = glob.Graphics.getHeight();

          ctxt.fillStyle = "#000000";
          ctxt.fillRect(0, 0, width, height);

          // Draw grid.
          for (iRow=0; iRow<height / this.bmp.height; ++iRow) {
            modVal = 1 - modVal;
            for (iCol=0; iCol<width / this.bmp.width; ++iCol) {
              if (iCol % 2 !== modVal) {
                ctxt.drawImage(this.bmp, iCol * this.bmp.width, iRow * this.bmp.height);
              }
            }
          }

          this.fnt.print(ctxt, "Font code by Mike 'Pomax' Kamerman", glob.Graphics.getWidth() / 2, glob.Graphics.getHeight() / 2 - this.bmp.height / 2, "#ffffff", 20, 0.5, 0.5);
          this.fnt.print(ctxt, "Music: 'Aircord' by DST", glob.Graphics.getWidth() / 2, glob.Graphics.getHeight() / 2 + this.bmp.height / 2, "#ffffff", 20, 0.5, 0.5);
        },

        mouseDown: function(x, y) {
          // Play the 'button down' sound.
          glob.Sound.play(this.snd);

          return true;
        }
      }
    },
  ]
);

// Create the game ////////////////////////////////////////////////////////////
var game = new game.TestGame();


