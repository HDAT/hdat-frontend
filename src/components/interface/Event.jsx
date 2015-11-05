import React from 'react';
import { Router, Route, Link } from 'react-router';

class Event extends React.Component{
	render() {
		return(
			<div className="event">
				<div className="event-container">
				  <div className="dot"></div>
				  <div className="pulse"></div>
				</div>

				<h4 className="tagtext-container">
				<span className="tagtext-wrap">
					<span className="tagtext-inner">
						Chinese occupation of Tibet
					</span>
				</span>
				</h4>
			</div>
		)
	}
}

export default Event;