import React from 'react';

class ShipViewer extends React.Component{
	render() {
		var ship = this.props.ship;
		return(
			<div className="shipviewer__ship">
				<h3>{ ship.name }</h3>
				<p> </p>
			</div>
		)
	}
}

export default ShipViewer;