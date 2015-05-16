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

        var trackID = trackID;

        this._tracks.map(function(track, index){
            if (track.id == trackID) {
                // remove track without leaving hole in array
                _tracks.splice(index, 1);
            }
        });
    },

    isTrack : function(isTrackID){
        //!!! FUNCTION MOCKED !!! WILL NOT WORK PROBABLY !!!
        // Check if track is available
        return this._tracks.map(function(track, index){
            if (track.id == isTrackID){
                return true;
            }
        });
    },

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