import React from 'react';
import ReactDOM from 'react-dom';
import ElementQueries from '../../../node_modules/css-element-queries/src/ElementQueries';
import ResizeSensor from '../../../node_modules/css-element-queries/src/ResizeSensor';


class Timeline extends React.Component{
	timeSliderHover(){
		var _this = this;

		window.requestAnimationFrame(function(){
			var node = ReactDOM.findDOMNode(_this);
			if (node !== undefined) {
				var timeline = document.querySelector('.timeline-player'),
					timeSlider = document.querySelector('.time-slider'),
					year = document.querySelectorAll('.extra-years-container');

				timeSlider.addEventListener("mouseover", function(){
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
				});
				timeSlider.addEventListener("mouseout", function(){
					timeline.className = 'timeline-player';
					for(let i=0; i < year.length; i++) {
						year[i].className = 'extra-years-container';
					}
				})
			}
		});
	}
	componentDidMount(){
		this.timeSliderHover();
	}
	render() {
		return(
			<div className="timeline">
				<div className="timeline-player">
					<ul className="year-container">
						<li className="year hide-narrow"><div className="extra-years-container"></div><span>1710</span></li>
						<li className="year"><div className="extra-years-container"></div><span>1720</span></li>
						<li className="year hide-narrow"><div className="extra-years-container"></div><span>1730</span></li>
						<li className="year"><div className="extra-years-container"></div><span>1740</span></li>
						<li className="year hide-narrow"><div className="extra-years-container"></div><span>1750</span></li>
						<li className="year"><div className="extra-years-container"></div><span>1760</span></li>
						<li className="year hide-narrow"><div className="extra-years-container"></div><span>1770</span></li>
						<li className="year"><div className="extra-years-container"></div><span>1780</span></li>
						<li className="year hide-narrow"><div className="extra-years-container"></div><span>1790</span></li>
						<li className="year"><div className="extra-years-container"></div><span>1800</span></li>
					</ul>
				</div>
			</div>
		)
	}
}

export default Timeline;