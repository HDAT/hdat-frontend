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