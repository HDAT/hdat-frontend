import React from 'react';
import { Router, Route, Link } from 'react-router';
import cargoGui from '../../../../assets/data/cargoGui.json';

import GoodsItem from './goods-item.jsx';
import GoodsNav from './goods-nav.jsx';

class Goods extends React.Component{
	constructor(props){
		super(props);
		this.state = {supermarket: cargoGui["a"]};
	}
	render() {
		return (
			<div className="filter-container container-fluid">
				<GoodsNav />
				<div className="filters">
					<ul className="filterColumn">
						{this.state.supermarket.map((product, key)=>{return(
								<GoodsItem key={key} product={product} />
						);})}
					</ul>
				</div>
			</div>
		);
	}
}

export default Goods;