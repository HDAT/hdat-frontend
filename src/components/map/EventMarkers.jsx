import React from 'react';
import { LayerGroup, Marker } from 'react-leaflet';

class EventMarkers extends React.Component{
    render() {
        return (
        	<LayerGroup>
	    		<Marker position={{lat: 51.505,lng: -0.09}}/>
        	</LayerGroup>
  		);
    }
}

export default EventMarkers;