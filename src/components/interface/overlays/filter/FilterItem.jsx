import React from 'react';

class FilterItem extends React.Component{
	render() {
		return(
			<li className="filter-item">
				{this.props.product.name}
				<span className="number">{this.props.product.textcount}</span>
			</li>
		)
	}
}

export default FilterItem;