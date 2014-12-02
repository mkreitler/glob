// [HELP]
// <h1>glob.Sound</h1><hr>
// <em>Allows programs to load and play sounds.</em>
//
// <strong>Interface</strong>
// glob.Sound.setMasterVolume(newVolume); /*Where newVolume must be in the range [0, 1];*/
// var volume = glob.Sound.getMasterVolume();
// var newSound = glob.Sound.load(soundName, onLoadedCallback, onErrorCallback, nChannels, repeatDelay);
// glob.Sound.deactivate();
// glob.Sound.activate();
// glob.Sound.stopAll();
// glob.Sound.resetAll();
// glob.Sound.unloadAll();
// glob.Sound.unload(soundName);
//
// <strong>Use</strong>
// <pre> glob.Sound.init();
// var newSound = glob.Sound.load(soundName, onLoadedCallback.bind(this), onErrorCallback.bind(this), nChannels, repeatDelay);
//
// /* Where soundName is the name of an audio resource uploaded to the server.
//       nChannels is the max number of voices that can play this sound simultaneously.
//       repeatDelay is the time, in seconds, that must pass before a subsequent voice is allowed to play.
//       onLoadedCallback(soundName, nChannels, loadEvent) is a function that will be called when
//       the sound data has loaded. */
//
// var channelIndex = glob.Sound.play(newSound);
// Returns index of the channel that was played. -1 indicates the sound didn't play.
//
// glob.Sound.loop(newSound);
// glob.Sound.stop(newSound);
// glob.Sound.pause(newSound);
// glob.Sound.resume(newSound);
//
// [END HELP]

glob.Sound = new glob.NewGlobType({
// Class Definitions /////////////////////////////////////////////////////////////////
  FORMAT: {
	    MP3: {ext: 'mp3', mime: 'audio/mpeg'},
	    OGG: {ext: 'ogg', mime: 'audio/ogg; codecs=vorbis'}
	  },
  DEFAULT_CHANNELS: 2,
  DEFAULT_DELAY:    0.1,
  STOP_ALL_CHANNELS:-1,
  INVALID_CHANNEL:  -99,
	  
  isEnabled:       true,
  isAvailable:     window.Audio,
  preferredFormat: null,
  sounds:          {},
  masterVolume:    1.0,
  
  init: function() {
    var capTester = new Audio();
    var iFormat = 0;
    
    for (iFormat in glob.Sound.FORMAT) {
      if (capTester.canPlayType(glob.Sound.FORMAT[iFormat].mime) === "probably") {
        glob.Sound.preferredFormat = glob.Sound.FORMAT[iFormat];
        break;
      }
    }

    if (!this.preferredFormat) {
      for (iFormat in glob.Sound.FORMAT) {
        if (capTester.canPlayType(glob.Sound.FORMAT[iFormat].mime) === "maybe") {
          glob.Sound.preferredFormat = glob.Sound.FORMAT[iFormat];
          break;
        }
      }
    }
    
    if (!glob.Sound.preferredFormat) {
      glob.Sound.isAvailable = false;
      glob.Sound.isEnabled = false;
    }
  },
  
  activate: function() {
    glob.Sound.isEnabled = glob.Sound.isAvailable;
  },
  
  deactivate: function() {
    glob.Sound.stopAll();
    glob.Sound.isEnabled = false;
  },
  
  getFreeChannelIndex: function(sound, now) {
    var i = 0;
    var iChannel = glob.Sound.INVALID_CHANNEL;
    var mostDelay = 0;
    var testDelay = 0;
    
    if (sound && sound.channels.length && sound.playing.length && sound.lastPlayTime.length) {
      for (var i=0; i<sound.channels.length; ++i) {
        testDelay = (now - sound.lastPlayTime[i]) * 0.001;
        if (testDelay > mostDelay && testDelay > sound.minDelay) {
          mostDelay = testDelay;
          iChannel = i;
        }
      }
    }
    
    return iChannel;
  },
  
  play: function(sound, volume) {
    var totalVolume = typeof(volume) === 'undefined' ? 1 : volume;
    totalVolume = glob.Sound.clampVolume(totalVolume * glob.Sound.getMasterVolume());
    var playedIndex = glob.Sound.INVALID_CHANNEL;
    var now = Date.now();
    
    if (sound) {
      playedIndex = glob.Sound.getFreeChannelIndex(sound, now);
      
      try {
        if (playedIndex !== glob.Sound.INVALID_CHANNEL) {
          sound.iChannel = playedIndex;
          sound.lastPlayTime[playedIndex] = now;
          sound.channels[playedIndex].pause();
          sound.channels[playedIndex].loop = false;
          sound.channels[playedIndex].volume = totalVolume;
          sound.channels[playedIndex].currentTime = 0;
          sound.playing[playedIndex] = true;
          sound.channels[playedIndex].play();
        }
      }
      catch(err) {
        // Error message?
      }
    }
    
    return playedIndex;
  },
  
  loop: function(sound, volume) {
    var now = Date.now();
    var totalVolume = typeof(volume) === 'undefined' ? 1 : volume;
    totalVolume = glob.Sound.clampVolume(totalVolume * glob.Sound.getMasterVolume());
    var playedIndex = glob.Sound.INVALID_CHANNEL;
    
    if (sound) {
      playedIndex = glob.Sound.getFreeChannelIndex(sound, now);
      
      try {
        if (playedIndex !== glob.Sound.INVALID_CHANNEL) {
          sound.iChannel = playedIndex;
          sound.lastPlayTime[playedIndex] = now;
          sound.channels[playedIndex].pause();
          sound.channels[playedIndex].loop = true;
          sound.channels[playedIndex].volume = totalVolume;
          sound.channels[playedIndex].currentTime = 0;
          sound.playing[playedIndex] = true;
          sound.channels[playedIndex].play();
        }
      }
      catch(err) {
        // Error message?
      }
    }
    
    return playedIndex;
  },
  
  pause: function(sound, channelIndex) {
    var iChannel = 0;
    var iStart = typeof(channelIndex) === 'undefined' || channelIndex === glob.Sound.INVALID_CHANNEL ? 0 : channelIndex;
    var iEnd = typeof(channelIndex) === 'undefined' || channelIndex === glob.Sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;
    
    for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
      sound.channels[iChannel].pause();
      sound.playing[iChannel] = false;
    }
  },
  
  resume: function(sound, channelIndex) {
    var iChannel = 0;
    var iStart = typeof(channelIndex) === 'undefined' || channelIndex === glob.Sound.INVALID_CHANNEL ? 0 : channelIndex;
    var iEnd = typeof(channelIndex) === 'undefined' || channelIndex === glob.Sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;
    
    for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
      sound.channels[iChannel].play();
      sound.playing[iChannel] = true;
    }
  },
  
  stop: function(sound, channelIndex) {
    var iChannel = 0;
    var iStart = typeof(channelIndex) === 'undefined' || channelIndex === glob.Sound.INVALID_CHANNEL ? 0 : channelIndex;
    var iEnd = typeof(channelIndex) === 'undefined' || channelIndex === glob.Sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;

    if (channelIndex === glob.Sound.STOP_ALL_CHANNELS) {
      iStart = 0;
      iEnd = sound.channels.length - 1;
    }
    
    try {
      for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
        sound.channels[iChannel].pause();
        sound.channels[iChannel].loop = false;
        sound.channels[iChannel].currentTime = 0;
        sound.playing[iChannel] = false;
      }
    }
    catch(err) {
      // Error message?
    }
  },
  
  stopAll: function() {
    var key;
    
    for (key in glob.Sound.sounds) {
      glob.Sound.stop(glob.Sound.sounds[key], glob.Sound.STOP_ALL_CHANNELS);
    }
  },
  
  setMasterVolume: function(newMasterVolume) {
    glob.Sound.masterVolume = glob.Sound.clampVolume(newMasterVolume);
  },
  
  getMasterVolume: function() {
    return glob.Sound.masterVolume;
  },
  
  clampVolume: function(volume) {
    return Math.min(1, Math.max(0, volume));
  },
  
  load: function(resourceName, onLoadedCallback, onErrorCallback, nChannels, replayDelay) {
    var numChannels = nChannels || glob.Sound.DEFAULT_CHANNELS;
    var minReplayDelay = replayDelay || glob.Sound.DEFAULT_DELAY;
    
    var path = resourceName;
    var extension = path.substring(path.lastIndexOf("."));
    var nNewChannels = 0;
    var i = 0;
    var newChannel = null;

    if (glob.Sound.preferredFormat) {
      if (extension) {
        path = path.replace(extension, "");
      }
    
      path = path + "." + glob.Sound.preferredFormat.ext;
      
      if (!glob.Sound.sounds[resourceName] ||
        glob.Sound.sounds[resourceName].length < nChannels) {
      
        if (!glob.Sound.sounds[resourceName]) {
          glob.Sound.sounds[resourceName] = {
            channels:     [],
            playing:      [],
            lastPlayTime: [],
            minDelay:     minReplayDelay,
          };
        }
        
        nNewChannels = numChannels - glob.Sound.sounds[resourceName].channels.length;
        for (i=0; i<nNewChannels; ++i) {
          newChannel = new Audio(path);
          
          if (onLoadedCallback) {
            newChannel.addEventListener('canplaythrough', function callback() {
              onLoadedCallback(glob.Sound.sounds[resourceName], resourceName);
            }, false);
          }
          
          if (onErrorCallback) {
            newChannel.addEventListener('onerror', function callback() {
              onErrorCallback(resourceName);
            }, false);
          }
        
          newChannel.preload = "auto";
          newChannel.load();
          glob.Sound.sounds[resourceName].channels.push(newChannel);
          glob.Sound.sounds[resourceName].playing.push(false);
          glob.Sound.sounds[resourceName].lastPlayTime.push(0);
        }
      }
    }
    else if (onLoadedCallback) {
      onLoadedCallback(resourceName, "Error: no preferred format");
    }
    
    return glob.Sound.sounds[resourceName];
  },
},  
{
// Instance Definitions //////////////////////////////////////////////////////////////
  audioClip: null,
  
});

glob.Sound.init();