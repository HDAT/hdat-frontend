import React from 'react';
import ReactDOM from 'react-dom';
import Line from 'react-chartjs';
// import chartData from '';


class GoodsGraph extends React.Component{
	render() {
		return(
			<div>
				<LineChart data={chartData} options={chartOptions} width="600" height="250"/>
			</div>
		)
	}
}

export default GoodsGraph;
