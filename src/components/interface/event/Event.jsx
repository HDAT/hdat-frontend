import React from 'react';
import EventPulse from './EventPulse.jsx';
import EventTag from './EventTag.jsx';
import {Map, Marker} from 'react-leaflet';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Event extends React.Component{
	render() {
		{ // if (this.props.FilterHits == "< 10") {
		// 	var cssNumber = "number small";
		// } else {
		// 	var cssNumber = "number";
		// } 
		}  
		var entireEvent = L.divIcon({className: 'my-div-icon', html: '<p>Blabla</p>'});
		console.log(entireEvent);
		// L.marker([50.505, 30.57], {icon: entireEvent}).addTo(map);
		return(

			<div className="event">
				<EventPulse />

				<ReactCSSTransitionGroup transitionName="event-anim" transitionEnterTimeout={500} transitionLeaveTimeout={300} >
					<EventTag TagInnerText={this.props.TagInnerText} />
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}

export default Event;