import React from 'react';

class FilterItem extends React.Component{
	render() {
		if (this.props.FilterHits == "< 10") {
			var cssNumber = "number small";
		} else {
			var cssNumber = "number";
		}
		return(
			<li className="filter-item">
				{this.props.FilterNaam}
				<span className={cssNumber}>{this.props.FilterHits}</span>
			</li>
		)
	}
}

export default FilterItem;