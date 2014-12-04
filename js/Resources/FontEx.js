
// [HELP]
// <h1>glob.FontEx</h1><hr>
// <em>Supports download and display of TrueType and OpenType fonts.</em>
//
// <strong>Interface</strong>
// measureText: function(textString, fontSize);
// measureSegment: function(textSegment, fontSize, metrics);
//
// <strong>Use</strong>
// <pre>var FontTest = function() {
//   this.onLoaded = function(fontName, font) {
//     /* Use getContext to use the canvas for drawing. */
//     graphics.lock();
//     graphics.clearToColor("#000000");
//  
//     graphics.fillStyle    = '#00FFFF';
//     graphics.font         = "30px '" + this.testFont.fontFamily + "'";
//     graphics.textBaseline = 'top';
//      
//     graphics.fillText('Asteroids!', document._gameCanvas.width * 0.5, document._gameCanvas.height * 0.5);
//    
//     graphics.unlock();
//   };
//  
//   this.onError = function(fontName) {
//     alert("Failed to load " + fontName);
//   };
// };
//
// var fontTest = new FontTest();</pre>

// <strong>Notes</strong>
// Adapted from use from WebJS from Mike "Pomax" Kamermans' <a href="http://github.com/Pomax/Font.js" target=_blank>Font.js class.</a>
// Used and distributed under the MIT "expat" license.
// [END HELP]

/**
  Font.js v2012.01.25
  (c) Mike "Pomax" Kamermans, 2012
  Licensed under MIT ("expat" flavour) license.
  Hosted on http://github.com/Pomax/Font.js

  This library adds Font objects to the general pool
  of available JavaScript objects, so that you can load
  fonts through a JavaScript object similar to loading
  images through a new Image() object.

  Font.js is compatible with all browsers that support
  <canvas> and Object.defineProperty - This includes
  all versions of Firefox, Chrome, Opera, IE and Safari
  that were 'current' (Firefox 9, Chrome 16, Opera 11.6,
  IE9, Safari 5.1) at the time Font.js was released.

  Font.js will not work on IE8 or below due to the lack
  of Object.defineProperty - I recommend using the
  solution outlined in http://ie6update.com/ for websites
  that are not corporate intranet sites, because as a home
  user you have no excuse not to have upgraded to Internet
  Explorer 9 yet, or simply not using Internet Explorer if
  you're still using Windows XP. If you have friends or
  family that still use IE8 or below: intervene.

  You may remove every line in this header except for
  the first block of four lines, for the purposes of
  saving space and minification. If minification strips
  the header, you'll have to paste that paragraph back in.

  Issue tracker: https://github.com/Pomax/Font.js/issues

**/
glob.Resources.FontEx = new glob.NewGlobType(
null,
{
  init: function() {
    this.font = null
  },

  print: function(context, text, x, y, color, size, hAlign, vAlign) {
    var textColor = color || "#00FFFF";
    var vertAlign = "top";
    var textSize = (size || 30) + "px";
    var measure = hAlign || vAlign ? this.measureText(text, size) : null;

    if (hAlign) {
      x = x - hAlign * (measure.bounds.maxx - measure.bounds.minx);
    }

    if (vAlign) {
      y = y - vAlign * (measure.bounds.maxy - measure.bounds.miny);
    }

    context.save();

    context.fillStyle    = textColor;
    context.font         = textSize + " '" + this.font.fontFamily + "'";
    context.textBaseline = vertAlign;
     
    context.fillText(text, x, y);
   
    context.restore();
  },
  
  setFont: function(font) {
    this.font = font;
  },
  
  getFont: function() {
    return this.font;
  },
  
  getMetrics: function() {
    return this.font ? this.font.metrics : null;
  },
  
  measureText: function(text, size) {
    var result = this.font ? this.font.measureText(text, size) : false;

    if (!result) {
      result = {bounds: {minx:0, maxx:0, miny: 0, maxy: 0}};
    }

    return result;
  }
});

