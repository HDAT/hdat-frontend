import React from 'react';
import { Link } from 'react-router';

class LeftMenu extends React.Component{
	render() {
		return(
		<div className="menu left-fixed-menu">
			<ul className="menu__icons left-menu">
				<Link to="/narrativelink">
					<li className="menu__icons__singleicon storymode-icon" activeClassName="menu-active">
					</li>
				</Link>
				<Link to="/sharelink">
					<li className="menu__icons__singleicon share-icon" activeClassName="menu-active">
					</li>
				</Link>
				<li className="menu__icons__singleicon gear-icon" activeClassName="menu-active">
				</li>
				<Link to="/goods/a" activeClassName="menu-active">
					<li className="menu__icons__singleicon minardmode-icon">
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