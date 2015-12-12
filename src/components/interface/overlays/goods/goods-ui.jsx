import React from 'react';

import GoodsList from './goods-list.jsx';
import GoodsNav from './goods-nav.jsx';

import cargoGui from '../../../../assets/data/interface/cargoGui.json';

class GoodsUI extends React.Component{
	componentWillMount(){
		this.setState({supermarket: cargoGui[this.props.params.letter]});
	}
	componentWillReceiveProps(nextProps){
		this.setState({supermarket: cargoGui[nextProps.params.letter]});
	}
	render() {
		return (
			<div className="filter-container container-fluid">
				<GoodsNav />
        		<GoodsList goods={this.state.supermarket} />
			</div>
		);
	}
}

export default GoodsUI;