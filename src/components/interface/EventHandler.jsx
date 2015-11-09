import React from 'react';
import ReactDOM from 'react-dom';
import Event from './event/Event.jsx';
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
				// console.log(L.DomEvent);

				tSlider.addEventListener('input', function() {
				    if (tSlider.value > 9047469689 && tSlider.value < 9057469689) {
				    	// console.log(_this.state);
				    	_this.setState({ showEvent: true, anim: "event-anim-in" });
				    } else {
				    	_this.setState({ showEvent: false, anim: "event-anim-remove" });
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
			this.state.showEvent ? <Event TagInnerText="Chinese occupation of Tibet" Anim={this.state.anim} /> : null
		)
	}
}

export default EventHandler;