// [HELP]
// <h1>glob.Resources</h1><hr>
//
// <em>Retrieves image, audio, font, and text/svg data from the server.</em>
//
// <strong>Interface</strong>
// loadImage = function(imageURL);
// loadSound = function(soundURL);
// loadFont = function(fontURL);
// loadSVG = function(svgURL);
//
// <strong>Use</strong>
// <pre> var myLoader = {
//   onSoundLoaded = function(sound, soundName) {...},
//   onImageLoaded = function(image) {...},
//   onFontLoaded = function(font) {...},
//   onSVGloaded = function(svgText) {...},
//   onErrorCallback = function(errorText) {...}
// };
//
// glob.Resources.loadSound("mySound", myLoader.onSoundLoaded, myLoader.onErrorCallback, this, nChannels, minDelay);
// glob.Resources.loadImage("myImage", myLoader.onImageLoaded, myLoader.onErrorCallback, this);
// glob.Resources.loadFont("myFont", myLoader.onFontLoaded, myLoader.onErrorCallback, this);
// glob.Resources.loadSVG("mySVG", myLoader.onSVGloaded, myLoader.onErrorCallback, this);</pre>
//
// <strong>Notes</strong>
// TODO: maintain a total resource count and add a progress API.
// [END HELP]

glob.ResourceLoader = new glob.NewGlobType(null, {
// Static Definitions /////////////////////////////////////////////////////////
  resourcesPending: 0,
  resourcesLoaded: 0,

  loadImage: function(imageURL, onLoadedCallback, onErrorCallback, observer) {
    var image = new Image();

    glob.Resources.incPendingCount();
  
    image.onload = function() {
      glob.Resources.incLoadedCount(true);
      if (onLoadedCallback) { onLoadedCallback.call(observer, image); }
    }
    
    image.onerror = function() {
      glob.Resources.incLoadedCount(false);
      if (onErrorCallback) { onErrorCallback.call(observer, imageURL); }
    }
  
    image.src = imageURL;
  
    return image;
  },

  loadFont: function(fontURL, family, onLoadedCallback, onErrorCallback, observer) {
    glob.Resources.incPendingCount();

    family = family || fontURL;

    var newFont = new Font();
    var newFontEx = new glob.Resources.FontEx();
    
    newFont.fontFamily = family;
    newFont.src = fontURL;
    newFontEx.setFont(newFont);
    
    newFont.onload = function() {
                      glob.Resources.incLoadedCount(true);
                      if (onLoadedCallback && observer) { onLoadedCallback.call(observer, font); }
                    };

    newFont.onerror = function() {
                      glob.Resources.incLoadedCount(false);
                      if (onErrorCallback && observer) { onErrorCallback.call(observer, fontURL); }
                    };
    
    return newFontEx;
  },
  
  loadSound: function(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec) {
    glob.Resources.incPendingCount();

    return glob.Sound.load(soundURL,
        function() {
          glob.Resources.incLoadedCount(true);
          if (onLoadedCallback) { onLoadedCallback.call(observer, soundURL); }
        },
        function() {
          glob.Resources.incLoadedCount(false);
          if (onLoadedCallback) { onLoadedCallback.call(observer, soundURL); }
        },
        nChannels, repeatDelaySec);
  },

  loadSVG: function(svgName, onLoadedCallback, onErrorCallback, observer) {
    var xhr = new XMLHttpRequest();
    var url = "http://www.freegamersjournal.com/svg-edit-2.6/php/loadSVG.php";
    var title = svgName;
    var matches = null;
  
    glob.Resources.incPendingCount();

    xhr.open("POST", url, true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText && xhr.responseText.substring(0, "ERROR:".length) === "ERROR:") {
            if (onErrorCallback) onErrorCallback.call(observer);
          }
          else if (onLoadedCallback) {
            glob.Resources.incLoadedCount(true);
            onLoadedCallback.call(observer, xhr.responseText);
          }
        }
        else if (xhr.responseText) {
          glob.Resources.incLoadedCount(false);
          if (onErrorCallback) onErrorCallback.call(observer, svgName);
        }
      }
    }

    xhr.send("name=" + svgName);  
  }
},
{
// Instance Definitions ///////////////////////////////////////////////////////
});

glob.Resources = {
  resourcesPending: 0,
  bResourceLoadSuccessful: true,
  resourcesLoaded: 0,
  resourcesRequested: 0,
  loader: new glob.ResourceLoader(),

  EZstartDownloadState: function(stateMachine, nextState) {
    if (stateMachine && nextState) {
      // ResourceLoad State -----------------------------------------
      var nResLoaded = 0,
          extraTime = 3; // HACK! Must be a better way to ensure the font has loaded completely.

      stateMachine.setState({
        enter: function() {},
        exit: function() {},

        update: function(dt) {
          nResLoaded = glob.Resources.getLoadedCount();
          if (glob.Resources.getLoadProgress() > 1 - glob.Math.EPSILON) {
            if (extraTime - dt < 0) {
              this.setState(nextState);
            }
            else {
              extraTime = extraTime - dt;
            }
          }
        },

        draw: function(ctxt) {
          var width = glob.Graphics.getWidth(),
              height = glob.Graphics.getHeight();

          ctxt.fillStyle = "#000000";
          ctxt.fillRect(0, 0, width, height);
          if (extraTime >= 1.5) {
            glob.Graphics.showMessage(ctxt, "Loaded " + nResLoaded + (nResLoaded === 1 ? " resource..." : " resources..."), "#ff0000", true, 0, glob.Graphics.getHeight() / 2);
          }
          else {
            glob.Graphics.showMessage(ctxt, "Preparing resources...", "#ffff00", true, 0, glob.Graphics.getHeight() / 2);
          }
        }
      });
    }
  },

  getLoadProgress: function() {
    var completion = this.resourcesRequested > 0 ? this.resourcesLoaded / this.resourcesRequested : 1.0;

    if (!this.bResourceLoadSuccessful) {
      completion != -1.0;
    }

    return completion;
  },

  getLoadedCount: function() {
    return this.resourcesLoaded;
  },

  incPendingCount: function() {
    this.resourcesPending += 1;
    this.resourcesRequested += 1;
  },

  incLoadedCount: function(bLoadSuccessful) {
    this.resourcesLoaded += 1;
    this.resourcesPending -= 1;

    this.bResourceLoadSuccessful &= bLoadSuccessful;
  },

  loadComplete: function() {
    return this.resourcesPending === 0 && this.resourcesLoaded === this.resourcesRequested;
  },

  loadSuccessful: function() {
    return this.bResourceLoadSuccessful;
  },

  loadImage: function(imageURL, onLoadedCallback, onErrorCallback, observer) {
    return this.loader.loadImage(imageURL, onLoadedCallback, onErrorCallback, observer);
  },

  loadBitmapFont: function(fontURLs, onLoadedCallback, onErrorCallback, observer) {
    return this.loader.loadBimapFont(fontURLs, onLoadedCallback, onErrorCallback, observer);
  },

  loadFont: function(fontURL, onLoadedCallback, onErrorCallback, observer) {
    return this.loader.loadFont(fontURL, onLoadedCallback, onErrorCallback, observer);
  },

  loadSound: function(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec) {
    return this.loader.loadSound(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec);
  },

  loadSVG: function(svgName, onLoadedCallback, onErrorCallback, observer) {
    return this.loader.loadSVG(svgName, onLoadedCallback, onErrorCallback, observer);
  }
};


