import React from 'react';
import ReactDOM from 'react-dom';
import Event from './Event.jsx';
import EventsData from '../../../assets/data/events.json';
// import { Router, Route, Link } from 'react-router';

class EventHandler extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			showEvent: false
		};
	}
	timeSliderHover(){
		var _this = this;

		window.requestAnimationFrame(function(){
			var node = ReactDOM.findDOMNode(_this);
			if (node !== undefined) {

				var tSlider = document.querySelector(".time-slider");

				tSlider.addEventListener('input', function() {
				    if (tSlider.value > 9047469689 && tSlider.value < 9057469689) {
				    	_this.setState({ showEvent: true});
				    	console.log("Yihaaa");
				    } else {
				    	_this.setState({ showEvent: false});
				    }
				});
			}
		});
	}
	componentDidMount(){
		this.timeSliderHover();
	}
	render() {
		return(
			this.state.showEvent ? <Event TagInnerText="Chinese invasion of Tibet" /> : null
		)
	}
}

export default EventHandler;