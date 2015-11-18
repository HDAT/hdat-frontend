import React from 'react';
import ReactDOM from 'react-dom';

class Timeline extends React.Component{
	timelineToggle() {
		document.querySelector('.timeline').classList.toggle('timeline-triggered');
	}
	render() {
		return(
			<ul className="timeline" onMouseEnter={this.timelineToggle} onMouseLeave={this.timelineToggle}>
				{ [1710,1720,1730,1740,1750,1760,1770,1780,1790,1800].map(function(value, key){
					return (
						<li key={key} className="year">
							<div className="decade-needles"></div>
							<span>{value}</span>
						</li>
				)})}
			</ul>
		)
	}
}

export default Timeline;