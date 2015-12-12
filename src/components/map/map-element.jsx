import React from 'react';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, LayerGroup, GeoJson } from 'react-leaflet';

import MapWithVoyages from './playback/map-with-voyages.jsx';
import minardData from '../../assets/data/map/minard/product-id-1000.json';

class MapElement extends React.Component{
    render() {
        return (
	        <MapWithVoyages 
	        	className="map-container" 
	    		center={[10, 45]} 
	    		zoom={3} 
	    		minZoom={3} 
	    		maxZoom={6} 
	    		maxBounds={[[-75, 179],[75, -179]]}>
	    		<GeoJson data={minardData} style={(feature)=>{
		           	return {  
		           		weight: feature.properties.cargovalues / 20000, 
	                    color: '#2fcdfc', 
	                    opacity: 0.2, 
	                    lineJoin: 'miter',
	                    lineCap: 'butt' }; 
		            }}/>
	    		<TileLayer url={'tiles/base/{z}/{x}/{y}.png'} />
	    		<TileLayer url={'tiles/overlay/{z}/{x}/{y}.png'} />
	  		</MapWithVoyages>
  		);
    }
}

export default MapElement;