import React from 'react';

import GoodsList from './goods-list.jsx';
import GoodsNav from './goods-nav.jsx';

import goodsListData from '../../../../assets/data/interface/goods-list-data.json';

class GoodsUI extends React.Component{
	componentWillMount(){
		this.setState({supermarket: goodsListData[this.props.params.letter]});
	}
	componentWillReceiveProps(nextProps){
		this.setState({supermarket: goodsListData[nextProps.params.letter]});
	}
	render() {
		return (
			<div className="filter-container container-fluid">
				<GoodsNav />
        <GoodsList changeProduct={this.props.changeProduct} goods={this.state.supermarket} />
			</div>
		);
	}
}

export default GoodsUI;