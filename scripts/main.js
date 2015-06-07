'use strict';

// UMD initialization to work with CommonJS, AMD and basic browser script include
(function (factory) {
	var L;
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['leaflet'], factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// Node/CommonJS
		L = require('leaflet');
		module.exports = factory(L);
	} else {
		// Browser globals
		if (typeof window.L === 'undefined'){
			throw 'Leaflet must be loaded first';
		}
		factory(window.L);
	}
}(function (L) {

L.Playback = L.Playback || {};

L.Playback.Util = L.Class.extend({
  statics: {

    DateStr: function(time) {
      return new Date((time - 15768000000) * 1000 ).toDateString();
    },

    TimeStr: function(time) {
      var d = new Date((time - 15768000000) * 1000 );
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();
      var tms = time / 1000;
      var dec = (tms - Math.floor(tms)).toFixed(2).slice(1);
      var mer = 'AM';
      if (h > 11) {
        h %= 12;
        mer = 'PM';
      } 
      if (h === 0) {h = 12;}
      if (m < 10) {m = '0' + m;}
      if (s < 10) {s = '0' + s;}
      return h + ':' + m + ':' + s + dec + ' ' + mer;
    },

    SeasonStr: function(time) {
      var d = new Date((time - 15768000000) * 1000 );
      var m = d.getMonth();
      var season = '';
      if ((m >= 12) || (m <= 2)) { season = 'Winter'; }
      if ((m >= 3) && (m <= 5)) { season = 'Spring'; }
      if ((m >= 6) && (m <= 8)) { season = 'Summer'; }
      if ((m >= 9) && (m <= 11)) { season = 'Autumn'; }
      return season;
    },

    YearStr: function(time){
      var d = new Date((time - 15768000000) * 1000 );
      var y = d.getFullYear();
      return y;
    },
  }
});

L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({    
    initialize: function (startLatLng, options, feature, map, markerLayer) {    
        var markerOptions = options.marker || {};
        this._feature =  feature;
        this._map = map;
        this._markerLayer = markerLayer;
        
        if (typeof markerOptions === 'function'){
            markerOptions = markerOptions(feature);
        }

        L.Marker.prototype.initialize.call(this, startLatLng, markerOptions);
        
        if (markerOptions.clickCB){
            this.on('click', markerOptions.clickCB.bind(this, feature));
        }

        // this.popupContent = '';

        // if (markerOptions.getPopup){
        //     this.popupContent = markerOptions.getPopup(feature);            
        // }
        
        // this.bindPopup(this.getPopupContent());
        // this.bindPopup(this.getPopupContent() + startLatLng.toString());
    },
    
    getPopupContent: function() {
        if (this.popupContent !== ''){
            return '<b>' + this.popupContent + '</b><br/>';
        }
        
        return '';
    },

    move: function (latLng, transitionTime) {
        // Only if CSS3 transitions are supported
        if (L.DomUtil.TRANSITION) {
            if (this._icon) { 
                this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
                if (this._popup && this._popup._wrapper){
                    this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
                }
            }
            if (this._shadow) { 
                this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
            }
        }
        this.setLatLng(latLng);
        // if (this._popup) {
        //     this._popup.setContent(this.getPopupContent() + this._latlng.toString());
        // }    
    }
});

L.Playback = L.Playback || {};

L.Playback.Track = L.Class.extend({
    initialize : function (map, geoJSON, options, markerLayer) {
        options = options || {};
        var tickLen = options.tickLen || 250;
        
        this._geoJSON = geoJSON;
        this._tickLen = tickLen;
        this._ticks = [];
        this._marker = null;
        this._map = map;
        this._markerLayer = markerLayer;

        var sampleTimes = geoJSON.properties.time;
        var samples = geoJSON.geometry.coordinates;
        var currSample = samples[0];
        var nextSample = samples[1];
        var currSampleTime = sampleTimes[0];
        var t = currSampleTime;  // t is used to iterate through tick times
        var nextSampleTime = sampleTimes[1];
        var tmod = t % tickLen; // ms past a tick time
        var rem,
        ratio;

        // handle edge case of only one t sample
        if (sampleTimes.length === 1) {
            if (tmod !== 0){
                t += tickLen - tmod;
            }
            this._ticks[t] = samples[0];
            this._startTime = t;
            this._endTime = t;
            return;
        }

        // interpolate first tick if t not a tick time
        if (tmod !== 0) {
            rem = tickLen - tmod;
            ratio = rem / (nextSampleTime - currSampleTime);
            t += rem;
            this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
        } else {
            this._ticks[t] = currSample;
        }

        this._startTime = t;
        t += tickLen;
        while (t < nextSampleTime) {
            ratio = (t - currSampleTime) / (nextSampleTime - currSampleTime);
            this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
            t += tickLen;
        }

        // iterating through the rest of the samples
        for (var i = 1, len = samples.length; i < len; i++) {
            currSample = samples[i];
            nextSample = samples[i + 1];
            t = currSampleTime = sampleTimes[i];
            nextSampleTime = sampleTimes[i + 1];

            tmod = t % tickLen;
            if (tmod !== 0 && nextSampleTime) {
                rem = tickLen - tmod;
                ratio = rem / (nextSampleTime - currSampleTime);
                t += rem;
                this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
            } else {
                this._ticks[t] = currSample;
            }

            t += tickLen;
            while (t < nextSampleTime) {
                ratio = (t - currSampleTime) / (nextSampleTime - currSampleTime);
                
                if (nextSampleTime - currSampleTime > options.maxInterpolationTime){
                    this._ticks[t] = currSample;
                }
                else {
                    this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
                }
                
                t += tickLen;
            }
        }

        // the last t in the while would be past bounds
        this._endTime = t - tickLen;
        this._lastTick = this._ticks[this._endTime];

    },

    _interpolatePoint : function (start, end, ratio) {
        try {
            var delta = [end[0] - start[0], end[1] - start[1]];
            var offset = [delta[0] * ratio, delta[1] * ratio];
            return [start[0] + offset[0], start[1] + offset[1]];
        } catch (e) {
            console.log('err: cant interpolate a point');
            console.log(['start', start]);
            console.log(['end', end]);
            console.log(['ratio', ratio]);
        }
    },

    getFirstTick : function () {
        return this._ticks[this._startTime];
    },

    getLastTick : function () {
        return this._ticks[this._endTime];
    },

    getStartTime : function () {
        return this._startTime;
    },

    getEndTime : function () {
        return this._endTime;
    },
    
    tick : function (timestamp) {
        // This is interesting. If outside of timebound it sets the track to the
        // last or first tick. We dont want that. Or we do, but we want it to 
        // toggle the marker here.

        if (timestamp > this._endTime){
            timestamp = this._endTime;
            this._markerLayer.removeLayer(this._marker);
        } else if (timestamp < this._startTime){
            timestamp = this._startTime;
            this._markerLayer.removeLayer(this._marker);
        } else {
            this._marker.addTo(this._markerLayer);   
        }

        return this._ticks[timestamp];
    },
    
    setMarker : function(timestamp, options){
        var lngLat = null;
        
        // if time stamp is not set, then get first tick
        if (timestamp) {
            lngLat = this.tick(timestamp);
        }
        else {
            lngLat = this.getFirstTick();
        }        
    
        if (lngLat) {
            var latLng = new L.LatLng(lngLat[1], lngLat[0]);
            this._marker = new L.Playback.MoveableMarker(latLng, options, this._geoJSON, this._map, this._markerLayer);                
        }
        
        return this._marker;
    },
    
    moveMarker : function(latLng, transitionTime) {
        if (this._marker) {
            this._marker.move(latLng, transitionTime);
        }
    },
    
    getMarker : function() {
        return this._marker;
    }
});

L.Playback = L.Playback || {};

L.Playback.TrackController = L.Class.extend({

    initialize : function (map, tracks, options) {
        this.options = options || {};
    
        this._map = map;
        
        this._tracks = [];
    },
    
    clearTracks: function(){
        // called by setData, does what is expected of it.
        while (this._tracks.length > 0) {
            var track = this._tracks.pop();
            var marker = track.getMarker();
            
            if (marker){
                this._map.removeLayer(marker);
            }
        }            
    },
    
    addTrack : function (track, timestamp) {
        // return if nothing is set

        // FIRST REAL EDIT SHOULD BE HERE. 
        // point where marker is added should change. it should not be here.
        // As far as I see now, the track is no problem. 

        if (!track) {
            return;
        }

        var marker = track.setMarker(timestamp, this.options);

        if (marker) {
            // marker.addTo(this._map);
            
            this._tracks.push(track);
        }
    },

    removeTrack : function(trackID){
        //!!! FUNCTION MOCKED !!! WILL NOT WORK PROBABLY !!!

        // Not neccecairy right now, will need to be written in the future I
        // suspect.

        this._tracks.map(function(track, index){
            if (track.id === trackID) {
                // remove track without leaving hole in array
                this._tracks.splice(index, 1);
            }
        });
    },
/*
    isTrack : function(isTrackID){
        //!!! FUNCTION MOCKED !!! WILL NOT WORK PROBABLY !!!
        // Check if track is available

        return this._tracks.map(function(track, index){
            if (track.id === isTrackID){
                return true;
            }
        });
    },
*/

    tock : function (timestamp, transitionTime) {
        // For each track determine new position and move the markers.
        // This function is a central cog in the playback wheel

        // Reponse to the clock's ticks. It checks all the possible ticks for 
        // a givens track, selects the right one, and moves the marker.

        for (var i = 0, len = this._tracks.length; i < len; i++) {
            var lngLat = this._tracks[i].tick(timestamp);
            var latLng = new L.LatLng(lngLat[1], lngLat[0]);
            this._tracks[i].moveMarker(latLng, transitionTime);
        }
    },

    getStartTime : function () {
        // Oke as it is. To trackscontrol there is no time outside the tracks.

        var earliestTime = 0;

        if (this._tracks.length > 0) {
            earliestTime = this._tracks[0].getStartTime();
            for (var i = 1, len = this._tracks.length; i < len; i++) {
                var t = this._tracks[i].getStartTime();
                if (t < earliestTime) {
                    earliestTime = t;
                }
            }
        }
        
        return earliestTime;
    },

    getEndTime : function () {
        // idem as start

        var latestTime = 0;
    
        if (this._tracks.length > 0){
            latestTime = this._tracks[0].getEndTime();
            for (var i = 1, len = this._tracks.length; i < len; i++) {
                var t = this._tracks[i].getEndTime();
                if (t > latestTime) {
                    latestTime = t;
                }
            }
        }
    
        return latestTime;
    },

    getTracks : function () {
        return this._tracks;
    }
});
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

// Simply shows all of the track points as circles.
// TODO: Associate circle color with the marker color.

L.Playback = L.Playback || {};

L.Playback.TracksLayer = L.Class.extend({
    initialize : function (map, options, feature) {
        var layerOptions = options.layer || {};
        
        if (typeof layerOptions === 'function') {
            layerOptions = layerOptions(feature);
        }

        if (!layerOptions.pointToLayer) {
            layerOptions.pointToLayer = function (featureData, latlng) {
                return new L.CircleMarker(latlng, { radius : 5 });
            };
        }
    
        this.layer = new L.GeoJSON(null, layerOptions);

        var overlayControl = {
            'GPS Tracks' : this.layer
        };

        L.control.layers(null, overlayControl, {
            collapsed : false
        }).addTo(map);
    },

    // clear all geoJSON layers
    clearLayer : function(){
        for (var i in this.layer._layers) {
            this.layer.removeLayer(this.layer._layers[i]);            
        }
    },

    // add new geoJSON layer
    addLayer : function(geoJSON) {
        this.layer.addData(geoJSON);
    }
});
L.Playback = L.Playback || {};

L.Playback.PlayControl = L.Control.extend({
    options : {
        position : 'bottomleft'
    },

    initialize : function (playback) {
        this.playback = playback;
    },

    onAdd : function () {
        this._container = L.DomUtil.create('div', 'hdat-control-play');

        var self = this;
        var playback = this.playback;
        playback.setSpeed(100);

        var playControl = L.DomUtil.create('div', '', this._container);

        this._button = L.DomUtil.create('button', '', playControl);

        function play(){
            if (playback.isPlaying()) {
                playback.stop();
                self._button.classList.toggle('pause');
            }
            else {
                playback.start();
                self._button.classList.toggle('pause');
            }                
        }

        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
        .on(this._button, 'click', stop)
        .on(this._button, 'mousedown', stop)
        .on(this._button, 'dblclick', stop)
        .on(this._button, 'click', L.DomEvent.preventDefault)
        .on(this._button, 'click', play, this);

        return this._container;
    }
}); 

L.Playback.DateControl = L.Control.extend({
    options : {
        position: 'bottomleft',
        dateFormatFn: L.Playback.Util.DateStr,
        seasonFormatFn: L.Playback.Util.SeasonStr,
        timeFormatFn: L.Playback.Util.TimeStr,
        yearFormatFn: L.Playback.Util.YearStr
    },

    initialize : function (playback, options) {
        L.setOptions(this, options);
        this.playback = playback;
    },

    onAdd : function () {
        // this._container = L.DomUtil.create('div', 'timebar');
        this._container = L.DomUtil.create('div', 'hdat-control-season');

        var self = this;
        var playback = this.playback;
        var time = playback.getTime();

        var datetime = L.DomUtil.create('div', '', this._container);

        // date time
        this._season = L.DomUtil.create('p', 'seasons', datetime);

        this._season.innerHTML = this.options.seasonFormatFn(time) + ' ' + this.options.yearFormatFn(time);
       
        // setup callback
        playback.addCallback(function (ms) {
            self._season.innerHTML = self.options.seasonFormatFn(ms) + ' ' + self.options.yearFormatFn(ms);
        });

        return this._container;
    }
});   
    
L.Playback.SliderControl = L.Control.extend({
    options : {
        position : 'bottomleft',
        yearFormatFn: L.Playback.Util.YearStr
    },

    initialize : function (playback) {
        this.playback = playback;
    },

    onAdd : function (map) {
        this._container = L.DomUtil.create('div', 'hdat-control-timeline');

        var self = this;
        var playback = this.playback;

        //timeline dates
        this._sliderStartTime = L.DomUtil.create('p', '', this._container);
        this._sliderStartTime.innerHTML = this.options.yearFormatFn(playback.getStartTime());
        this._sliderEndTime = L.DomUtil.create('p', '', this._container);
        this._sliderEndTime.innerHTML = this.options.yearFormatFn(playback.getEndTime());

        // slider
        this._slider = L.DomUtil.create('input', '', this._container);
        this._slider.type = 'range';
        this._slider.min = playback.getStartTime();
        this._slider.max = playback.getEndTime();
        this._slider.value = playback.getTime();

        function onSliderChange(e) {
            var val = Number(e.target.value);
            playback.setCursor(val);
        }

        playback.addCallback(function (ms) {
            self._slider.value = ms;
        });
   
        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
        .on(this._slider, 'click', stop)
        .on(this._slider, 'mousedown', stop)
        .on(this._slider, 'dblclick', stop)
        .on(this._slider, 'click', L.DomEvent.preventDefault)
        //.on(this._slider, 'mousemove', L.DomEvent.preventDefault)
        .on(this._slider, 'change', onSliderChange, this)
        .on(this._slider, 'mousemove', onSliderChange, this);           
        
        map.on('playback:add_tracks', function() {
            self._slider.min = playback.getStartTime();
            self._slider.max = playback.getEndTime();
            self._slider.value = playback.getTime();
        });

        return this._container;
    }
});      

L.Playback = L.Playback.Clock.extend({

        //? Statics are simply setting the methods to constants for the app. But in the case of this app, it also prevents them from being destroyed.

        statics : {
            MoveableMarker : L.Playback.MoveableMarker,
            Track : L.Playback.Track,
            TrackController : L.Playback.TrackController,
            Clock : L.Playback.Clock,
            Util : L.Playback.Util,
            
            TracksLayer : L.Playback.TracksLayer,
            PlayControl : L.Playback.PlayControl,
            DateControl : L.Playback.DateControl,
            SliderControl : L.Playback.SliderControl
        },

        //? Also a convenience method from leaflet. Makes merging options a little bit easier as can be seen in the initialise below. L.setOptions() uses these defaults and merges them with the arguments it is given

        options : {
            tickLen: 250,
            speed: 1,
            maxInterpolationTime: 5*60*1000, // 5 minutes

            tracksLayer : true,
            
            playControl: false,
            dateControl: false,
            sliderControl: false,
            
            // options
            layer: {
                // pointToLayer(featureData, latlng)
            },
            
            marker : {
                // getPopup(feature)
            }
        },

        //? The constructor functions for the class. This is called when the new statement is run (which is internally done by leaflet)

        initialize : function (map, geoJSON, callback, options) {
            //? see options above, merges defaults with arguments
            L.setOptions(this, options);
            
            this._map = map;

            //? Creates stuff, trackController. 
            this._trackController = new L.Playback.TrackController(map, null, this.options);

            //? Clock is a bit more complicated. The call method set the 'this' value to this 'this'. Basicly equalising the scope of the Playback class to that of the Clock class even more. Playback is an extention of Clock in the first place, so Playback has access to everything Clock is. But I suppose he wanted Clock to have access to everything that Playbck has too. 

            L.Playback.Clock.prototype.initialize.call(this, this._trackController, callback, this.options);
            
            //? Simple enough: creates every controller if options have them specified to true.

            if (this.options.tracksLayer) {
                this._tracksLayer = new L.Playback.TracksLayer(map, options);
            }

            //? Bit more interesting function. I think this starts up the entire machine.
            this.setData(map, geoJSON);       

            if (this.options.sliderControl) {
                this.sliderControl = new L.Playback.SliderControl(this);
                this.sliderControl.addTo(map);
            }     
            
            if (this.options.dateControl) {
                this.dateControl = new L.Playback.DateControl(this, options);
                this.dateControl.addTo(map);
            }

            if (this.options.playControl) {
                this.playControl = new L.Playback.PlayControl(this);
                this.playControl.addTo(map);
            }
        },
        
        clearData : function(){
            //? Clear enough: tells the trackscontroller to erase everything. We need less violent delete. removeTrack or smthing. Also clears out the tracksLayer. A utility we don't really need if we're doing it with tiles.

            this._trackController.clearTracks();
            
            if (this._tracksLayer) {
                this._tracksLayer.clearLayer();
            }
        },
        
        setData : function (map, geoJSON) {

            //? Called by initialize. It's weird. It removes everything first, while everything should be empty on load. But who knows their evil motives.   

            this.clearData();
        
            //? This function appends the tracks given to options. Highly interesting function. I suppose this will do. 

            //?? Note: It trows in time which is a function on Clock (that's where the prototype.call() came in, this refers to Playback aswell as Clock)
            
            //??? Missing its opposite, removeData. But perhaps that's not needed. We need to determine somekind of dataflow architecture.


            this.addData(map, geoJSON, this.getTime());

            //? Set the (time) cursor to the start of the show.
            //!!! getStarttime needs editting.

            this.setCursor(this.getStartTime());
        },

        // bad implementation
        addData : function (map, geoJSON, ms) {
            this._markerLayer = L.featureGroup(L.marker([50.5, 30.5])).addTo(map);
            
            // return if data not set
            if (!geoJSON) {
                return;
            }
            
            //? Loops over the GeoJSON and adds each single track in it. Don't really know (yet) why time is trown into addTrack() too.
            if (geoJSON instanceof Array) {
                for (var i = 0, len = geoJSON.length; i < len; i++) {
                    this._trackController.addTrack(new L.Playback.Track(map, geoJSON[i], this.options, this._markerLayer), ms);
                }
            } else {
                this._trackController.addTrack(new L.Playback.Track(map, geoJSON, this.options), ms);
            }

            //? This fire's a custom event of somekind, seems important but has no connection to the internal working of the code.
            // this._map.fire('playback:set:data');
            
            //? Trivial - tracksLayer is disconnected from the main functionality.
            if (this.options.tracksLayer) {
                this._tracksLayer.addLayer(geoJSON);
            }                  
        },

        addDataStream: function(){
            //!!! FUNCTION MOCKED !!! WILL NOT WORK PROBABLY !!!
            this.dataStream = new L.Playback.DataStream(this);
        },

        destroy: function() {
            // Never called. Leaving it in because it might be usefull someday.
            this.clearData();
            if (this.playControl) {
                this._map.removeControl(this.playControl);
            }
            if (this.sliderControl) {
                this._map.removeControl(this.sliderControl);
            }
            if (this.dateControl) {
                this._map.removeControl(this.dateControl);
            }
        }
    });

//? This factory method is because of the way Leaflet Classes function. Because leaflet classes could be created without a new statement, it implements the new here. 

//? ENTRY!!!

L.playback = function (map, geoJSON, callback, options) {
    return new L.Playback(map, geoJSON, callback, options);
};
return L.Playback;

}));

(function(L){

// Leaflet shit

var southWest   = L.latLng(-75, 179),
    northEast   = L.latLng(75, -179),
    bounds      = L.latLngBounds(southWest, northEast);

var satellite   = L.tileLayer('images/tiles/baselayer/{z}/{x}/{y}.png', {id: 'satellite'}),
    geography   = L.tileLayer('images/tiles/overlay/{z}/{x}/{y}.png', {id: 'geography'});
  
var map = new L.Map('map', {
  zoomControl:          true,
  center:               [10, 45],
  minZoom:              3,
  maxZoom:              6,
  zoom:                 3,
  maxBounds:            bounds,
  attributionControl:   false,
  inertia:              true,
  layers:               [satellite, geography]
});

L.Icon.Default.imagePath = 'images/leaflet';
  
var shipIcon = L.icon({
    iconUrl:                'images/hdat-shipicon.png',
    className:              'hdat-shipicon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10]   // icon center point
});

// var slider = document.querySelector('.selectspeed').addEventListener('input', function(e){
//     playback.setSpeed(e.target.value);
// });



// Leaflet playback configuration


var markerOptions = function(feature){
    return {
      icon: shipIcon,
      clickCB: function(feature, event){
        // remove popup
        if (document.querySelector('.popup')) {
          document.querySelector('.popup').parentNode.removeChild(document.querySelector('.popup'));
        }

        var southWest = L.latLng(this._latlng.lat - 0.1, this._latlng.lng - 0.1),
            northEast = L.latLng(this._latlng.lat + 0.1, this._latlng.lng + 0.1),
            bounds = L.latLngBounds(southWest, northEast),
            inBounds = [];

        this._markerLayer.eachLayer(function(marker) {
          if (bounds.contains(marker.getLatLng())) {
              inBounds.push(marker._feature);
          }
        });

        var popup = document.querySelector('.popup');
        // create popup
        if (!popup) {
          var popup = document.createElement('div');
          popup.classList.add('popup');
          document.querySelector('body').appendChild(popup);
        }

        popup.innerHTML = "";

        console.log(feature)

        inBounds.map(function(feature){
          var featureA = document.createElement('a');
          featureA.innerHTML = feature.voyagedetails.first_ship_name;
          featureA.href = "http://bgb.huygens.knaw.nl/bgb/voyage/" + feature.voyagedetails.voynumber;
          popup.appendChild(featureA);
        });
      }
    };
};

var playbackOptions = {
    playControl:            true,
    dateControl:            true,
    sliderControl:          true,
    tickLen:                (3600*24),
    tracksLayer:            false,
    maxInterpolationTime:   46464646464646,
    marker:                 markerOptions
};
var data, playback;

// Ajax shit 
var onDataCB = function () {
    if (ajax.readyState !== 4 || ajax.status !== 200) {
      return;
    }
    data = JSON.parse(ajax.responseText);
    playback = new L.Playback(map, data, null, playbackOptions);
};

var ajax = new XMLHttpRequest(); 
ajax.open('GET', 'data/json/voyages.json', true);
ajax.onreadystatechange = onDataCB;
ajax.send();

// Other stuff

// Feedback blink
window.setTimeout(function(){
  document.querySelector('.form-button').classList.add('form-timer');
}, 30000)

})(L);