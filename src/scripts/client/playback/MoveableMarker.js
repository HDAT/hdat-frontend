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