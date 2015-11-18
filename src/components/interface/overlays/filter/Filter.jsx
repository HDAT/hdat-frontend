import React from 'react';
import { Router, Route, Link } from 'react-router';
import cargoGui from '../../../../assets/data/cargoGui.json';

import FilterItem from './FilterItem.jsx';
import FilterNav from './FilterNav.jsx';

class Filter extends React.Component{
	constructor(props){
		super(props);
		var data = [];
		var thisLetter = "a";
		var currentLetter = cargoGui[thisLetter];
		var lengte = currentLetter.length;
		var step = lengte / 4;

		for (var iterator = 0; iterator < lengte ; iterator+=step){
			data.push(currentLetter.slice(iterator,iterator+step));
		}
		this.state = {supermarket: data};
	}
	render() {
		return (
			<div className="filter-container">
				<FilterNav />
				<div className="filters">
					{this.state.supermarket.map((shelf, key)=>{return(
						<ul key={key} className="filterColumn">
							{shelf.map((product, key)=>{return(
								<FilterItem key={key} product={product} />
							);})}
						</ul>
					);})}
				</div>
			</div>
		);
	}
}

export default Filter;