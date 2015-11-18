import React from 'react';

import GoodsItem from './goods-item.jsx';

class GoodsList extends React.Component{
	render(){
		return (<div className="filters">
			<ul className="filterColumn">
				{this.props.goods.map((product, key)=>{return(
					<GoodsItem key={key} product={product} />
				);})}
			</ul>
		</div>
	);}
}

export default GoodsList;