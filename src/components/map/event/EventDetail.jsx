import React from 'react';

class EventDetail extends React.Component{
	render() {
		return(
			<li className="event-li">
				<h5 className="event-li-kop">1750 - Chinese occupation of Tibet</h5>
				<p className="event-li-desc">The Chinese occupation would start in 1750. An uprising would happen in 1770. Two hundred years later the Ming-dynasty would again occupy it.</p>
				<span className="event-li-noot">Simon Gunn, The public culture of the Victorian middle class. Ritual and authority in the English industrial city, 1840-1914 (Manchester 2000) 84-85 en 91.</span>
			</li>
		)
	}
}

export default EventDetail;