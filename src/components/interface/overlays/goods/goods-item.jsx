import React from 'react';

class GoodsItem extends React.Component{
	render() {
		return(
			<li onClick={this.props.changeProduct.bind(null, this.props.product.carProductId)} className="filter-item">
				{this.props.product.name}
				<span className="number">{this.props.product.textcount}</span>
			</li>
		)
	}
}

export default GoodsItem;