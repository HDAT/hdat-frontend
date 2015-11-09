import React from 'react';
import { Router, Route, Link } from 'react-router';
import cargoGui from '../../assets/data/cargoGui.json';

import FilterItem from './filter/FilterItem.jsx';
import FilterNav from './filter/FilterNav.jsx';

class Filter extends React.Component{
	componentDidMount(){ 
		var data = [];
		var currentLetter = cargoGui.a;
		var lengte = currentLetter.length;
		var step = lengte / 4;

		for (var iterator = 0; iterator < lengte ; iterator+=step){
			data.push({"producten":currentLetter.slice(iterator,iterator+step)});
		}
		this.setState({supermarkt: data, letter: currentLetter});
	}

	render() {
		if (this.state) {
			return (
				<div className="filter-container">
					<FilterNav />
						<div className="filters">
							<ul className="filterRow">
								{ this.state.supermarkt[0].producten.map((singleProduct, index)=>{
									return (<FilterItem FilterNaam={singleProduct.name} 
											FilterId={singleProduct.carProductId} 
											FilterHits={singleProduct.textcount}
											key={singleProduct.carProductId} />);
								})}	
							</ul>	
							<ul className="filterRow">
								{ this.state.supermarkt[1].producten.map((singleProduct, index)=>{
									return (<FilterItem FilterNaam={singleProduct.name} 
											FilterId={singleProduct.carProductId} 
											FilterHits={singleProduct.textcount}
											key={singleProduct.carProductId} />);
								})}	
							</ul>	
							<ul className="filterRow">
								{ this.state.supermarkt[2].producten.map((singleProduct, index)=>{
									return (<FilterItem FilterNaam={singleProduct.name} 
											FilterId={singleProduct.carProductId} 
											FilterHits={singleProduct.textcount}
											key={singleProduct.carProductId} />);
								})}	
							</ul>
							<ul className="filterRow">
								{ this.state.supermarkt[3].producten.map((singleProduct, index)=>{
									return (<FilterItem FilterNaam={singleProduct.name} 
											FilterId={singleProduct.carProductId} 
											FilterHits={singleProduct.textcount} 
											key={singleProduct.carProductId} />);
								})}	
							</ul>									
						</div>														
				</div>
			);
		} else {
			return (
				<div className="filter-container">
					<h1>Er is niets met de letter </h1>
					}
				</div>); 
		}
	}
}

export default Filter;