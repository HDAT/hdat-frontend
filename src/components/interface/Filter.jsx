import React from 'react';
import { Router, Route, Link } from 'react-router';
import productsA from '../../assets/data/filter/a.json';

import FilterItem from './filter/FilterItem.jsx';
import FilterNav from './filter/FilterNav.jsx';

class Filter extends React.Component{
	componentDidMount(){ 
		var data =[];
		var lengte = productsA.length;
		var step = lengte / 4;

		for (var iterator = 0; iterator < lengte ; iterator+=step){
			data.push({"producten":productsA.slice(iterator,iterator+step)});
		}
		this.setState({supermarkt: data});
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
											FilterId="1" 
											FilterHits={singleProduct.textcount} />);
								})}	
							</ul>	
							<ul className="filterRow">
								{ this.state.supermarkt[1].producten.map((singleProduct, index)=>{
									return (<FilterItem FilterNaam={singleProduct.name} 
											FilterId="1" 
											FilterHits={singleProduct.textcount} />);
								})}	
							</ul>									
						</div>														
				</div>
			);
		} else {
			return (
				<div className="filter-container">
					<div>Loading</div>
				</div>); 
		}
	}
}

export default Filter;