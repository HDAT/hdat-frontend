import React from 'react';
import ReactDOM from 'react-dom';
import ElementQueries from '../../../node_modules/css-element-queries/src/ElementQueries';
import ResizeSensor from '../../../node_modules/css-element-queries/src/ResizeSensor';


class Timeline extends React.Component{

	timelineEnter() {
		var timeline = document.querySelector('.timeline'),
			timeSlider = document.querySelector('.time-slider'),
			year = document.querySelectorAll('.decade-needles');

		timeline.className += ' timeline-player-increased';
		for(let i=0; i < year.length; i++) {
			function addClass(){
				year[i].className += ' extra-years';
			}
			function addClassTimer() {
	  			window.setTimeout(addClass, 300);
			}
			addClassTimer();
		}
	}

	timelineLeave(){
		var timeline = document.querySelector('.timeline');
		var	year = document.querySelectorAll('.decade-needles');

		timeline.className = 'timeline';
		for(let i=0; i < year.length; i++) {
			year[i].className = 'decade-needles';
		}
	}

	render() {
		return(
			<ul className="timeline" onMouseEnter={this.timelineEnter} onMouseLeave={this.timelineLeave}>
				{ [1710,1720,1730,1740,1750,1760,1770,1780,1790,1800].map(function(value, key){
					return (
						<li key={key} className="year">
							<div className="decade-needles"></div>
							<span>{value}</span>
						</li>
				)})}
			</ul>
		)
	}
}

export default Timeline;