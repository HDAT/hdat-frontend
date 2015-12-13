import React from 'react';

import Ship from './ship.jsx';

class ShipViewer extends React.Component{
	render() {

		var ships = [{
				name: "De Zakkenroller",
				date: "28-12-1792"
			},
			{
				name: "De Maastricht",
				date: "12-12-1789"
			}
		];

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