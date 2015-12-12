import React from 'react';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, LayerGroup } from 'react-leaflet';

import MapWithVoyages from './playback/map-with-voyages.jsx';

class MapElement extends React.Component{
    render() {
        return (
	        <MapWithVoyages className="map-container" 
	    		center={[10, 45]} zoom={3} minZoom={3} maxZoom={6} maxBounds={[[-75, 179],[75, -179]]}>
	    		<TileLayer url={'tiles/base/{z}/{x}/{y}.png'} />
	    		<TileLayer url={'tiles/overlay/{z}/{x}/{y}.png'} />
	  		</MapWithVoyages>
  		);
    }
}

export default MapElement;