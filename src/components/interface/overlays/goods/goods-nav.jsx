import React from 'react';
import { Link } from 'react-router';

import letterList from '../../../../assets/data/cargoGuiNav.json';

class GoodsNav extends React.Component{
	render() {
		return(
			<nav>
				{ letterList.map((singleLetter, key)=>{return (
					<Link key={key} to={"/goods/" + singleLetter.letter}>
						<li>{singleLetter.letter}</li>
					</Link>
				);})}	
			</nav>
		)
	}
}

export default GoodsNav;