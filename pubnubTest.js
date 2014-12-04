// Tests basic PubNub functionality.

game = {};


game.TestGame = new glob.NewGlobType([
  // Class Definitions --------------------------------------------------------
  ],
  [
  // Instance Definitions -----------------------------------------------------
    glob.GameState.stateMachine,

    {
      FONT_HEIGHT: 20,

      init: function() {
        var self = this;

        this.message = "(Initializing PubNub...)";
        this.envelope = "None"
        this.channel = "None";
        this.nMessage = 0;

        // Create a network object.
        this.netObj = new glob.NetworkGlob('pub-c-b7f853ca-cc38-4a20-86aa-3544b0972145',
                                           'sub-c-96cd8c58-71fa-11e4-bbd1-02ee2ddab7fe');
        this.netObj.subscribe("hello_world", this.onMessageIn.bind(this), function() {
          self.netObj.publish("hello_world", "Left-click to send messages");
        });

        // Request some resources.
        this.fnt = glob.Resources.loadFont("res/NEUROPOL.ttf", "Ethnocentric");

        // Start resource download.
        glob.Resources.EZstartDownloadState(this, this.playState);
      },

      onMessageIn: function(message, envelope, channel) {
        this.message = JSON.stringify(message);
        this.envelope = JSON.stringify(envelope);
        this.channel = channel;
      },

      // Play State -----------------------------------------------
      playState: {
        draw: function(ctxt) {
          var yMid = glob.Graphics.getHeight() / 2;

          glob.Graphics.clearTo(glob.Graphics.BLACK);

          this.fnt.print(ctxt, "Message: " + this.message, glob.Graphics.getWidth() / 2, yMid - 3 * this.FONT_HEIGHT / 2, glob.Graphics.LT_GRAY, 20, 0.5, 0.5);
          this.fnt.print(ctxt, "Channel: " + this.channel, glob.Graphics.getWidth() / 2, yMid, glob.Graphics.LT_GRAY, 20, 0.5, 0.5);
          this.fnt.print(ctxt, "Envelope: " + this.envelope, glob.Graphics.getWidth() / 2, yMid + 3 * this.FONT_HEIGHT / 2, glob.Graphics.LT_GRAY, 20, 0.5, 0.5);
        },

        mouseDown: function(x, y) {
          this.netObj.publish("hello_world", "Message " + ++this.nMessage);

          return true;
        }
      }
    },
  ]
);

// Create the game ////////////////////////////////////////////////////////////
var game = new game.TestGame();


