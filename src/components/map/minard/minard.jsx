import React from 'react';
import { GeoJson } from 'react-leaflet';
import { geoJson } from 'leaflet';

class GeoJsonFix extends GeoJson {
	
	static propTypes() {
    return { data: React.PropTypes.object.isRequired || React.PropTypes.array.isRequired}
  };
  componentDidUpdate(prevProps){
  	super.componentDidUpdate()
    const { data, map, ...props} = this.props;
  	map.removeLayer(this.leafletElement);
    this.leafletElement = geoJson(data, props);
  	map.addLayer(this.leafletElement)
  }
}	

class Minard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			minardData: null
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
			xhr.open('GET', '/minard/' + newProps.selectedProduct + '.json');
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
