import React from 'react';

class FilterNav extends React.Component{
	handleClick(e){
 	   console.log('You clicked: ');
        e.preventDefault();
	}
	render() {
		var letterList = [
			{"letter": "a", "url": "/minardGui/a"},
			{"letter": "b", "url": "/minardGui/b"},
			{"letter": "c", "url": "/minardGui/c"},
			{"letter": "d", "url": "/minardGui/d"}

		];

		/* 			{"letter": "e"},
			{"letter": "f"},
			{"letter": "g"},
			{"letter": "h"},
			{"letter": "i"},
			{"letter": "j"},
			{"letter": "k"},
			{"letter": "l"},
			{"letter": "m"},
			{"letter": "n"},
			{"letter": "o"},
			{"letter": "p"},
			{"letter": "q"},
			{"letter": "r"},
			{"letter": "s"},
			{"letter": "t"},
			{"letter": "u"},
			{"letter": "v"},
			{"letter": "w"},
			{"letter": "x"},
			{"letter": "y"},
			{"letter": "z"}
			*/
		return(
			<nav>

			{ letterList.map((singleLetter)=>{
				return (<a onClick={this.handleClick}><li>{singleLetter.letter}</li></a>);
			})}	
			</nav>
		)
	}
}

export default FilterNav;