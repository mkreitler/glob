
glob.Transitions = {};

glob.Transitions.DEFAULT_PERIOD = 0.33;

// Transitions from 0.0 to 1.0 over the given period ==========================
glob.Transitions.InLinear = {
  init: function() {
    this.transTimer = 0;
    this.transParam = 0;
    this.transDrawFn = null;
    this.transUpdateFn = null;
    this.transPeriod = glob.Transitions.DEFAULT_PERIOD;
    this.transExitCallback = null;
  },

  startTransInLinear: function(transExitCallback, drawFn, updateFn, period, bReset) {
    if (bReset) {
      this.transTimer = 0;
      this.transParam = 0;
    }

    this.transExitCallback = transExitCallback;
    this.transPeriod = period || glob.Transitions.DEFAULT_PERIOD;
    this.transDrawFn = drawFn;
    this.transUpdateFn = updateFn;

    this.setState(this.transitionInState);
  },

  // Transition In State --------------------------------------------------
  transitionInState: {
    enter: function() {
    },

    update: function(dt, dtMS, gameTime) {
      this.transTimer += dt;

      if (this.transTimer > this.transPeriod) {
        // Transtion to new state.
        this.transTimer = this.transPeriod;
        this.transParam = 1.0;
        this.transExitCallback.call(this);
      }
      else {
        this.transParam = this.transTimer / this.transPeriod;
      }

      // Update the companion state, if any.
      if (this.transUpdateFn) {
        this.transUpdateFn(dt, dtMS, gameTime);
      }
    },

    draw: function(ctxt) {
      if (this.transDrawFn) {
        this.transDrawFn(ctxt);
      }
    }
  }
};

// Transitions from 1.0 to 0.0 over the input period ==========================
glob.Transitions.OutLinear = {
  init: function() {
    this.transTimer = 0;
    this.transParam = 0;
    this.transDrawFn = null;
    this.transUpdateFn = null;
    this.transPeriod = glob.Transitions.DEFAULT_PERIOD;
    this.transExitCallback = null;
  },

  startTransOutLinear: function(transExitCallback, drawFn, updateFn, period, bReset) {
    this.transExitCallback = transExitCallback;
    this.transPeriod = period || glob.Transitions.DEFAULT_PERIOD;
    this.transDrawFn = drawFn;
    this.transUpdateFn = updateFn;

    if (bReset) {
      this.transTimer = this.transPeriod;
      this.transParam = 1.0;
    }

    this.setState(this.transitionOutState);
  },
  // Transition Out State -------------------------------------------------
  transitionOutState: {
    enter: function() {
    },

    update: function(dt, dtMS, gameTime) {
      this.transTimer -= dt;

      if (this.transTimer < 0.0) {
        // Transtion to new state.
        this.transTimer = this.transPeriod;
        this.transParam = 0.0;
        this.transExitCallback.call(this);
      }
      else {
        this.transParam = this.transTimer / this.transPeriod;
      }

      // Update the companion state, if any.
      if (this.transUpdateFn) {
        this.transUpdateFn(dt, dtMS, gameTime);
      }
    },

    draw: function(ctxt) {
      if (this.transDrawFn) {
        this.transDrawFn(ctxt);
      }
    }
  }
};

