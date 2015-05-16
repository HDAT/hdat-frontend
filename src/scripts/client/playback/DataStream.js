L.Playback = L.Playback || {};

L.Playback.DataStream = L.Class.extend({
    //!!! ENTIRE CLASS MOCKED !!! WILL NOT WORK PROBABLY !!!

    getDataLight : function() {
        // this contruct an lightweight array without the actual data, 
        // only voyID, start and end time. It should derive this from the arraykeys

        // We could do this with two methods: 
        // One is by creating a indexed view beforehand.
        // The other is by constucting a indexed view on the fly.
        // Both have their advantages and disadvantages. It all depends on how
        // firebase really is when dealing with large ammounts of data.

        return dataRange;
    },

    getDataFull : function(trackID, addData) {
        return track;
    },

    appropriateTracks : function(dataLight, previousData, cursor){
        // Check dataLight for suitable tracks
        var appropriateTracks = dataLight.map(function(track, index){
            if (    timestamp > track.startTime 
                &&  timestamp < track.endTime) {
                return track;
            }
        });
        return appropriateTracks;
    },

    addKeepOrRemoveTracks : function(appropriateTracks){

        var toBeAddedTracks = [];

        if (appropriateTracks.length != 0) {
            toBeAddedTracks = appropriateTracks.map(function(track, index){
                // Check if track is already available,
                // If not return the it to be queued for adding
                if (!this._trackController.isTrack(track.id)){
                    return track;
                } 
            })
        }

        // Still needs something for removal of tracks! Although that might not
        // be need at all. Only if memory gets overloaded, but I suppose that 
        // should take a while. Bandwidth and response time worry me more.

        toBeAddedTracks.map(function(track, index){
            // get full data, and use vendor addData to add it to the tracks
            var fullTrack = getFullData(track.trackID, this.addData);

            // from playback
            this._trackController.addTrack(new L.Playback.Track(fullTrack, this.options), ms);
        })
    }
});