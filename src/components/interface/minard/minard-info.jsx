import React from 'react';
import { Link } from 'react-router';

class MinardInfo extends React.Component{
	render() {
		return(
			<div className="share">
				<h2>Minard</h2>
				<p>Bladiebladiebla</p>
				<Link to="/"><p>Close</p></Link>
			</div>
		)
	}
}

export default MinardInfo;