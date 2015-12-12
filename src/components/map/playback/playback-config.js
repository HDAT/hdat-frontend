import Leaflet from 'leaflet';
import MarkerIcon from '../../../assets/images/icons/hdat-shipicon.png';

var shipIcon = Leaflet.icon({
    iconUrl:                MarkerIcon,
    className:              'hdat-shipicon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10]   // icon center point
});

var markerOptions = function(feature){
	return {
	      icon: shipIcon,
	      clickCB: function(feature, event){
	        // remove popup
	        if (document.querySelector('.popup')) {
	          document.querySelector('.popup').parentNode.removeChild(document.querySelector('.popup'));
	        }

	        console.log('this bullshit');

	        var southWest = Leaflet.latLng(this._latlng.lat - 0.1, this._latlng.lng - 0.1),
	            northEast = Leaflet.latLng(this._latlng.lat + 0.1, this._latlng.lng + 0.1),
	            bounds = Leaflet.latLngBounds(southWest, northEast),
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
    speed:                  1,
    tracksLayer:            false,
    maxInterpolationTime:   46464646464646,
    marker:                 markerOptions
};

export default playbackOptions;