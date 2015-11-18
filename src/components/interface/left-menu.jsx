import React from 'react';
import { Link } from 'react-router';

class LeftMenu extends React.Component{
	render() {

		return(
		<div className="left-fixed-menu">
			<ul id="left-menu">
				<Link to="/narrativelink">
					<li className="storymode-icon" activeClassName="menu-active">
						<span className="storymode-tag"><span className="storymode-text">Narratives</span></span>
					</li>
				</Link>
				<Link to="/sharelink">
					<li className="share-icon" activeClassName="menu-active">
						<span className="storymode-tag"><span className="storymode-text">Narratives</span></span>
					</li>
				</Link>
				<li className="gear-icon" activeClassName="menu-active">
					<span className="storymode-tag"><span className="storymode-text">Narratives</span></span>
				</li>
				<Link to="/goods/a" activeClassName="menu-active">
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