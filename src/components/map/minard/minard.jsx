import React from 'react';
import { GeoJson } from 'react-leaflet';

import minardData from '../../../assets/data/map/minard/product-id-1000.json';

class GeoJsonFix extends GeoJson {
	static propTypes() {
    	return { data: React.PropTypes.object.isRequired || React.PropTypes.array.isRequired}
  	};
}

class Minard extends React.Component{
	render() {
    	var lineThickness = 40000;
		return (<div>
			{[lineThickness, lineThickness * 1.5, lineThickness * 3, lineThickness * 6].map((value, key)=>{
				var _value = value;
				var map = this.props.map;
				return <GeoJsonFix
					map={map}
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
	    </div>);
	}
}

export default Minard;
