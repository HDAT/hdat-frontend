import React from 'react';
import ElementQueries from '../../../node_modules/css-element-queries/src/ElementQueries';
import ResizeSensor from '../../../node_modules/css-element-queries/src/ResizeSensor';


class Timeline extends React.Component{
	render() {
		return(
			<div className="timeline">
				<div className="timeline-player">
					<ul className="year-container">
						<li className="year hide-narrow"><span>1710</span></li>
						<li className="year"><span>1720</span></li>
						<li className="year hide-narrow"><span>1730</span></li>
						<li className="year"><span>1740</span></li>
						<li className="year hide-narrow"><span>1750</span></li>
						<li className="year"><span>1760</span></li>
						<li className="year hide-narrow"><span>1770</span></li>
						<li className="year"><span>1780</span></li>
						<li className="year hide-narrow"><span>1790</span></li>
						<li className="year"><span>1800</span></li>
					</ul>
				</div>
			</div>
		)
	}
}

export default Timeline;