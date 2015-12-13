import React from 'react';

class ShipViewer extends React.Component{
	render() {
		var ship = this.props.ship;
		return(
			<div className="shipviewer__ship">
				<h3>{ ship.name }</h3>
				<p> { ship.departure.date } -> { ship.arrival.date}</p>
				<p> { ship.departure.location } -> { ship.arrival.location}</p>

			</div>
		)
	}
}

export default ShipViewer;