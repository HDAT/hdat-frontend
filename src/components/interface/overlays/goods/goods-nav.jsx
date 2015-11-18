import React from 'react';
import { Link } from 'react-router';

let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

class GoodsNav extends React.Component{
	render() {
		return(
			<nav>
				{ alphabet.map((letter, key)=>{return (
					<Link key={key} to={"/goods/" + letter}>
						<li>{letter}</li>
					</Link>
				);})}	
			</nav>
		)
	}
}

export default GoodsNav;