// Define engine namespace.
cj = {};

cj.assert = function(test, msg) {
  if (!test) {
    console.log(msg);
    debugger;
  }
};

// Base class constructor //////////////////////////////////////////////////////
cj.NewClass = function(staticModules, modules) {
  var iMod = 0,
      statModArray = cj.util.makeArray(staticModules),
      modArray = cj.util.makeArray(modules);

  _class = function() {
    this.init.apply(this, arguments);
  };

  _class.prototype = {};
  _class.prototype.extend = cj.NewClass.extend;
  _class.prototype.modArray = [];

  // Add static functions (attach static functions to _class object).
  for (iMod=0; statModArray && iMod<statModArray.length; ++iMod) {
    cj.NewClass.extendStatic.call(_class, statModArray[iMod]);
  }

  // Add instance methods (copy module objects into prototype).
  for (iMod=0; modArray && iMod<modArray.length; ++iMod) {
    cj.NewClass.extend.call(_class, modArray[iMod]);
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
        _class.prototype.modArray[iMod]apply(this, arguments);
      }
    }
  };

  _class.extendStatic = function() {
    cj.NewClass.extendStatic.apply(_class, arguments);
  }

  _class.extend = function(module) {
    cj.NewClass.extend.call(_class, module, _class.prototype);
  }

  return _class;
};

// Copy module functions into a prototype --------------------------------------
cj.NewClass.extendStatic = function(module) {
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

cj.NewClass.extend = function(module, proto) {
  var key = null;

  proto = proto || this.prototype;

  cj.assert(proto, "Cannot extend null prototype.");

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
cj.util = {};

cj.util.makeArray = function(item) {
  var arrayOut = item;

  if (item instanceof Array === false) {
    arrayOut = [];
    arrayOut.push(item);
  }

  return arrayOut;
};
