import React from 'react';
import { Router, Route, Link } from 'react-router';

class LeftMenu extends React.Component{
	render() {
		return(
		<div className="left-fixed-menu">
			<ul id="left-menu">
				<Link to="/narrativelink">
					<li className="storymode-icon">
						<span className="storymode-tag"><span className="storymode-text">Narratives</span></span>
					</li>
				</Link>
				<Link to="/sharelink">
					<li className="share-icon">
						<span className="storymode-tag"><span className="storymode-text">Narratives</span></span>
					</li>
				</Link>
				<li className="gear-icon">
					<span className="storymode-tag"><span className="storymode-text">Narratives</span></span>
				</li>
				<Link to="/filterlink">
				<li className="minardmode-icon">
					<span className="minardmode-tag"><span className="minardmode-text">Flow diagram</span></span>
					<ul className="legenda">
						<li className="minardcolor-legenda"></li>
					</ul>
				</li>
				</Link>
			</ul>
		</div>
		)
	}
}

export default LeftMenu;