import React from 'react';
import { Link } from 'react-router';

class Events extends React.Component{
	render() {
		return(
			<div className="menu-layer">
				<h2>Events</h2>
				<p>Bladiebladiebla</p>
				<Link to="/"><p>Close</p></Link>
			</div>
		)
	}
}

export default Events;