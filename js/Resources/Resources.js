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

  // loadBitmapFont: function(fontURLs, onLoadedCallback, onErrorCallback, observer) {
  //   var font = null,
  //       image = null,
  //       fontURL = null,
  //       i = 0;

  //       if (!(fontURLs instanceof Array)) {
  //         fontURL = fontURLs;
  //         fontURLs = [];
  //         fontURLs.push(fontURL);
  //       }

  //       font = new glob.Resources.BitmapFont();

  //       for (i=0; i<fontURLs.length; ++i) {
  //         image = glob.Resources.loader.loadImage(fontURLs[i],
  //                                                function() {
  //                                                             if (onLoadedCallback) { onLoadedCallback.call(observer, image) }
  //                                                             font.onLoad(image);
  //                                                           },
  //                                                onErrorCallback,
  //                                                observer);
  //         font.addImage(image);
  //       }

  //   return font;
  // },
  
  loadFont: function(fontURL, onLoadedCallback, onErrorCallback, observer) {
    glob.Resources.incPendingCount();

    var font = glob.Resources.FontEx.newFromResource(fontURL,
               function() {
                 glob.Resources.incLoadedCount(true);
                 if (onLoadedCallback) { onLoadedCallback.call(observer, font); }
               },
               function() {
                 glob.Resources.incLoadedCount(false);
                 if (onErrorCallback) { onErrorCallback.call(observer, fontURL); }
               },
               observer);    
    
    return font;
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
    return this.loader.loadFont();
  },

  loadSound: function(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec) {
    return this.loader.loadSound(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec);
  },

  loadSVG: function(svgName, onLoadedCallback, onErrorCallback, observer) {
    return this.loader.loadSVG(svgName, onLoadedCallback, onErrorCallback, observer);
  }
};


