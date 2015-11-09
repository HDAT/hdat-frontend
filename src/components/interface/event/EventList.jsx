import React from 'react';
import EventDetail from './EventDetail.jsx'

class EventList extends React.Component{
	render() {
		return(
			<ul className="event-list">
				<EventDetail />
			</ul>
		)
	}
}

export default EventList;