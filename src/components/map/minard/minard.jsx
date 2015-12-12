import React from 'react';
import { GeoJson } from 'react-leaflet';
import { geoJson } from 'leaflet';

class GeoJsonFix extends GeoJson {
	static propTypes() {
    return { data: React.PropTypes.object.isRequired || React.PropTypes.array.isRequired}
  };
  componentWillUpdate(nextProps, nextState){
  	console.log(this.props)
  	// const { data, map, ...props } = nextProps;
    this.leafletElement = geoJson(nextProps.data);
  }
}

class Minard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			minardData: {
		    "type": "Point",
		    "coordinates": [
		        -105.01621,
		        39.57422
		    ]
			}
		}
	}
	componentWillReceiveProps(newProps){
		if (this.props.selectedProduct !== newProps.selectedProduct){
			console.log('starting XHR for: ', newProps.selectedProduct);
			var self = this; 
			function xhrCb () {
				self.setState({minardData: JSON.parse(this.responseText)});
			}
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load', xhrCb);
			xhr.open('GET', '/minard/product-id-' + newProps.selectedProduct + '.json');
			xhr.send();
		}
	}

	render() {
  	var lineThickness = 40000;
		return (<div>
			{[lineThickness, lineThickness * 1.5, lineThickness * 3, lineThickness * 6].map((value, key)=>{
				var _value = value;
				var _map = this.props.map;
				return <GeoJsonFix
					data={this.state.minardData}
					map={_map}
					key={key}
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
