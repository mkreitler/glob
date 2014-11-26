// Define engine namespace.
glob = {};

glob.assert = function(test, msg) {
  if (!test) {
    console.log(msg);
    debugger;
  }
};

// Base class constructor //////////////////////////////////////////////////////
glob.NewGlob = function(staticModules, modules) {
  var iMod = 0,
      statModArray = glob.util.makeArray(staticModules),
      modArray = glob.util.makeArray(modules);

  _class = function() {
    this.init.apply(this, arguments);
  };

  _class.prototype = {};
  _class.prototype.extend = glob.NewGlob.extend;
  _class.prototype.modArray = [];

  // Add static functions (attach static functions to _class object).
  for (iMod=0; statModArray && iMod<statModArray.length; ++iMod) {
    glob.NewGlob.extendStatic.call(_class, statModArray[iMod]);
  }

  // Add instance methods (copy module objects into prototype).
  for (iMod=0; modArray && iMod<modArray.length; ++iMod) {
    glob.NewGlob.extend.call(_class, modArray[iMod]);
  }

  // Provide overall init function (calls 'init' on all modules).
  _class.prototype.init = function() {
    var iMod = 0;

    for (iMod=0; _class.prototype.modArray && iMod<_class.prototype.modArray.length; ++iMod) {
      if (_class.prototype.modArray[iMod].init) {
        _class.prototype.modArray[iMod].init.apply(this, arguments);
      }
    }
  };

  _class.prototype.update = function(dt, dtMS) {
    var iMod = 0;

    for (iMod=0; _class.prototype.modArray && iMod<_class.prototype.modArray.length; ++iMod) {
      if (_class.prototype.modArray[iMod].update) {
        _class.prototype.modArray[iMod].update.apply(this, arguments);
      }
    }
  };

  _class.extendStatic = function() {
    glob.NewGlob.extendStatic.apply(_class, arguments);
  }

  _class.extend = function(module) {
    glob.NewGlob.extend.call(_class, module, _class.prototype);
  }

  return _class;
};

// Copy module functions into a prototype --------------------------------------
glob.NewGlob.extendStatic = function(module) {
  var key = null;

  if (module) {
    for (key in module) {
      if (this[key]) {
        console.log("Overriding static member '" + key + "'!");
      }
      else {
        this[key] = module[key];
      }
    }
  }
};

glob.NewGlob.extend = function(module, proto) {
  var key = null;

  proto = proto || this.prototype;

  glob.assert(proto, "Cannot extend null prototype.");

  if (proto && module) {
    proto.modArray.push(module);

    for (key in module) {
      if (proto[key]) {
        console.log("Overriding function '" + key + "'!");
      }
      else {
        proto[key] = module[key];
      }
    }
  }
};

// Utilities ///////////////////////////////////////////////////////////////////
glob.util = {};

glob.util.makeArray = function(item) {
  var arrayOut = item;

  if (item instanceof Array === false) {
    arrayOut = [];
    arrayOut.push(item);
  }

  return arrayOut;
};