import React from 'react';
import Leaflet from 'leaflet';
import { Map, TileLayer, Marker, LayerGroup, GeoJson } from 'react-leaflet';


import MapWithVoyages from './playback/map-with-voyages.jsx';
import minardData from '../../assets/data/map/minard/product-id-1000.json';

class GeoJsonFix extends GeoJson {
	static propTypes() {
    	return { data: React.PropTypes.object.isRequired || React.PropTypes.array.isRequired}
  	};
}

class MapElement extends React.Component{
    render() {
    	var lineThickness = 40000;
        return (
	        <MapWithVoyages 
	        	className="map-container" 
	    		center={[10, 45]} 
	    		zoom={3} 
	    		minZoom={3} 
	    		maxZoom={6} 
	    		maxBounds={[[-75, 179],[75, -179]]}>
	    		{[lineThickness, lineThickness * 1.5, lineThickness * 3, lineThickness * 6].map((value, key)=>{
	    			var _value = value;
	    			return <GeoJsonFix
	    				key={key}
	    				data={minardData} 
	    				style={(feature, _value)=>{
			           		return {  
				           		weight: feature.properties.cargovalues / value, 
			                    color: '#2fcdfc', 
			                    opacity: 0.2, 
			                }; 
			          }}/>
			    })}
	    		<TileLayer url={'tiles/base/{z}/{x}/{y}.png'} />
	    		<TileLayer url={'tiles/overlay/{z}/{x}/{y}.png'} />
	  		</MapWithVoyages>
  		);
    }
}

export default MapElement;