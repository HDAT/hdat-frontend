import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import "babel/polyfill";
import "../styles/app.scss";
import navGui from '../assets/data/cargoGuiNav.json';

import App from "./app.jsx";
import Narratives from "./interface/overlays/Narratives.jsx"
import Share from "./interface/overlays/Share.jsx";
import Filter from "./interface/overlays/Filter.jsx";

class RouterComponent extends React.Component{
	render() {
		return (
		  	<Router>
		  		{/* https://github.com/rackt/react-router/issues/1531 */}
		    	<Route path="/" component={App} >
		    		<Route path="narrativelink" component={Narratives} />
		        	<Route path="sharelink" component={Share} />
		        	{ navGui.map(function(value, key){
		        		return(<Route path={"filterlink/" + value.letter} component={Filter} filter={value.letter}/>)
		        		}) 
		        	}
		    	</Route>
		  	</Router>
		)
	}
}

export default RouterComponent;