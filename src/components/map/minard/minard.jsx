import React from 'react';
import { GeoJson } from 'react-leaflet';

class GeoJsonFix extends GeoJson {
	static propTypes() {
    return { data: React.PropTypes.object.isRequired || React.PropTypes.array.isRequired}
  };
}

class Minard extends React.Component{
	componentWillReceiveProps(newProps){
		function xhrCb () {
			this.setState({minardData: JSON.parse(this.responseText)});
		}
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', xhrCb);
		xhr.open('GET', './minard/product-id-' + newProps.selectedProduct + '.json');
		xhr.send();
	}
	render() {
  	var lineThickness = 40000;
		return (<div>
			{[lineThickness, lineThickness * 1.5, lineThickness * 3, lineThickness * 6].map((value, key)=>{
				var _value = value;
				var _map = this.props.map;
				return <GeoJsonFix
					data={this.state && this.state.hasOwnProperty('minardData') ? minardData : 0}
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
