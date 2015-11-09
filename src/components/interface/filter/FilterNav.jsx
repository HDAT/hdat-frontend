import React from 'react';

class FilterNav extends React.Component{
	componentDidMount(){
		var letterList = [
			{"letter": "a"},
			{"letter": "b"},
			{"letter": "c"},
			{"letter": "d"},
			{"letter": "e"},
			{"letter": "f"},
			{"letter": "g"},
			{"letter": "h"},
			{"letter": "i"},
			{"letter": "j"},
			{"letter": "k"}
		];
		console.log(letterList);
	}
	handleClick(){
 	   console.log('You clicked: ');
	}
	render() {

		return(
			<nav>
			 { /* this.state.letterList.map((singleLetter, index)=>{
				return (<li>{singleLetter.letter}</li>);
			})	*/
	}
				<li>C</li>
				<li>D</li>
				<li>E</li>
			</nav>
		)
	}
}

export default FilterNav;