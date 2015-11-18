import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import App from "./app.jsx";
import Narratives from "./interface/overlays/Narratives.jsx"
import Share from "./interface/overlays/Share.jsx";
import Filter from "./interface/overlays/Filter.jsx";

class RouterComponent extends React.Component{
	constructor(props){
		super(props);
		let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
		this.state = {
			data: {
				alphabet: alphabet
			}
		}
	}

	render() {
		let alphabet = this.state.data.alphabet;
		return (
		  	<Router>
		  		{/* https://github.com/rackt/react-router/issues/1531 */}
		    	<Route path="/" component={App} >
		    		<Route path="narrativelink" component={Narratives} />
		        	<Route path="sharelink" component={Share} />
		        	<Route path="filterlink" component={Filter} >
		        		{alphabet.map((letter, key)=>{
		        			return <Route key="key" path={alphabet[letter]} filter={alphabet[letter]} />
		        		})}
		        	</Route>
		    	</Route>
		  	</Router>
		)
	}
}

export default RouterComponent;