import React from 'react';
import EventPulse from './EventPulse.jsx';

class EventTag extends React.Component{
	render() {
		{ // if (this.props.FilterHits == "< 10") {
		// 	var cssNumber = "number small";
		// } else {
		// 	var cssNumber = "number";
		// } 
		// {this.props.TagInnerText} 
		}
		return(
			<div className="event">
				<EventPulse />

				<h4 className="tagtext-container">
				<span className="tagtext-wrap">
					<span className="tagtext-inner">
						{this.props.TagInnerText}
					</span>
				</span>
				</h4>
			</div>
		)
	}
}

export default EventTag;