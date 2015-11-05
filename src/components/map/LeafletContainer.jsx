import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import voyages from '../../assets/data/voyages.json';
import LeafletPlayback from '../../assets/scripts/LeafletPlayback.js';
import MarkerIcon from '../../assets/images/icons/hdat-shipicon.png';
import Leaflet from 'leaflet';

var position = [10, 45];

var bounds = [
  [-75, 179],
  [75, -179],
];

var tiles = 'tiles/base/{z}/{x}/{y}.png';
var tilesOverlay = 'tiles/overlay/{z}/{x}/{y}.png';

class LeafletPlaying extends Map{
	componentDidMount(){
		super.componentDidMount();
		this.leafletMap = this.getLeafletElement();

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

		console.log(playbackOptions);

		var playback = new LeafletPlayback(this.leafletMap, voyages, null, playbackOptions);
	}
}

class LeafletContainer extends React.Component{
    render() {
        return (
	        <LeafletPlaying className="map-container" 
	    		center={position} 
	    		zoom={3} 
	    		minZoom={3}
	    		maxZoom={6}
	    		maxBounds={bounds}
	    		>
	    		<TileLayer 
	    			url={tiles}
	    		/>
	    		<TileLayer 
	    			url={tilesOverlay}
	    		/>
	  		</LeafletPlaying>
  		);
    }
}

export default LeafletContainer;