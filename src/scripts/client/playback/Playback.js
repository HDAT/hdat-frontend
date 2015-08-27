
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