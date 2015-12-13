import React from 'react';

import Ship from './ship.jsx';

class ShipViewer extends React.Component{
	render() {
		var ships = [{
			name: "De Amsterdam",
			voyageRemarks: "Ahoy Maatje",
			arrival: {
				location: "Batavia",
				date: "12-12-1789",
				source: true
			},
			departure: {
				location: "Amsterdam",
				date: "12-12-1789",
				source: false
			},
			currentLocation: {
				location: "Brouwers Route"
			},
			totalValue: 400000,
			cargo: [{
				productName: 1000,
				quantity: "50 pieces",
				value: 23044
			},{
				productName: 1000,
				quantity: "50 pieces",
				value: 23044
			}],
			bgbLink: 10285
		},
		{
			name: "De Kampenaar",
			voyageRemarks: "Ahoy Maatje",
			arrival: {
				location: "Batavia",
				date: "12-12-1789",
				source: true
			},
			departure: {
				location: "Amsterdam",
				date: "12-12-1789",
				source: false
			},
			currentLocation: {
				location: "Kanaal"
			},
			totalValue: 400000,
			cargo: [{
				productName: 1000,
				quantity: "50 pieces",
				value: 23044
			},{
				productName: 1000,
				quantity: "50 pieces",
				value: 23044
			}],
			bgbLink: 10285
		}];

		return(
			<div className="shipviewer">
				<h2>Ships</h2>
				{ ships.map((ship, key)=>{
					return <Ship key={key} ship={ship}/>;})
				}
			</div>
		)
	}
}

export default ShipViewer;