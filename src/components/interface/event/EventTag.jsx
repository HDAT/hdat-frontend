import React from 'react';

class EventTag extends React.Component{
	render() {
		return(
			<h4 className="tagtext-container">
				<span className="tagtext-wrap">
					<span className="tagtext-inner">
						{this.props.TagInnerText}
					</span>
				</span>
			</h4>
		)
	}
}

export default EventTag;