 L.Playback = L.Playback || {};

L.Playback.Clock = L.Class.extend({

  initialize: function (trackController, callback, options) {
    this._trackController = trackController;
    this._callbacksArry = [];
    if (callback) {this.addCallback(callback);}
    L.setOptions(this, options);
    this._speed = this.options.speed;
    this._tickLen = this.options.tickLen;
    this._cursor = trackController.getStartTime();
    this._transitionTime = this._tickLen / this._speed;
  },

  _tick: function (self) {
    // This is the callback for the interval. What should happen if the clock
    // ticks? The tick generates tock as a response. Which is on the trackControl.

    if (self._cursor > self._trackController.getEndTime()) {
      clearInterval(self._intervalID);
      return;
    }
    self._trackController.tock(self._cursor, self._transitionTime);
    self._callbacks(self._cursor);
    self._cursor += self._tickLen;
  },

  _callbacks: function(cursor) {
    var arry = this._callbacksArry;
    for (var i=0, len=arry.length; i<len; i++) {
      arry[i](cursor);
    }
  },

  addCallback: function(fn) {
    this._callbacksArry.push(fn);
  },

  start: function () {
    // ENGINE. setInverval powers the whole code to continually run. 
    if (this._intervalID) {return;}
    this._intervalID = window.setInterval(
      this._tick, 
      this._transitionTime, 
      this);
  },

  stop: function () {
    if (!this._intervalID) {return;}
    clearInterval(this._intervalID);
    this._intervalID = null;
  },

  getSpeed: function() {
    return this._speed;
  },

  isPlaying: function() {
    return this._intervalID ? true : false;
  },

  setSpeed: function (speed) {
    this._speed = speed;
    this._transitionTime = this._tickLen / speed;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  setCursor: function (ms) {
    // Called by outside, ie. the controls. They can influence the code trough this.

    var time = parseInt(ms);
    if (!time) {return;}
    var mod = time % this._tickLen;
    if (mod !== 0) {
      time += this._tickLen - mod;
    }
    this._cursor = time;
    this._trackController.tock(this._cursor, 0);
    this._callbacks(this._cursor);
  },

  getTime: function() {
    return this._cursor;
  },

  getStartTime: function() {
    // This should contain a simple conditional to check the options a given
    // start. If so that should be the start time, wether or not the rest of the
    // code agrees with it. The clock is lord and master, tracksControl and tracks
    // just have to submit to father time. 

    // Also trackcontrol 

    return this._trackController.getStartTime();
  },

  getEndTime: function() {

    // Idem as getStartTime

    return this._trackController.getEndTime();
  },

  getTickLen: function() {
    return this._tickLen;
  }

});
