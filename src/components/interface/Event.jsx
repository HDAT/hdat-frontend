import React from 'react';
import ReactDOM from 'react-dom';
import EventTag from './event/EventTag.jsx';
// import { Router, Route, Link } from 'react-router';

class Event extends React.Component{
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
				// console.log(L.DomEvent);

				tSlider.addEventListener('input', function() {
				    if (tSlider.value > 9047469689 && tSlider.value < 9057469689) {
				    	console.log('Show');
				    	// console.log(_this.state);
				    	_this.setState({ showEvent: true });
				    } else {
				    	console.log('Dont show');
				    	_this.setState({ showEvent: false });
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
			this.state.showEvent ? <EventTag TagInnerText="Chinese occupation of Tibet" /> : null
		)
	}
}

export default Event;