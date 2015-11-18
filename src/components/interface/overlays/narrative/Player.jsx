import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

class Player extends React.Component{
	render() {
		return(
			<Draggable
	            start={{x: 0, y: 0}}
	            moveOnStartChange={false}
	            zIndex={100}
	            bounds={{top: -100, left: -150, right: 400, bottom: 400}}>
					<div className="player">
						<div className="slides">
							<span className="current-slide">10</span>
							<span className="total-slides">19</span>
						</div>
						<div className="slide-title">
							Burma
						</div>
						<div className="time">
							0:30
						</div>
					</div>
			</Draggable>
		)
	}
}

export default Player;