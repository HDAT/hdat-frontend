import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

import "babel/polyfill";
import "../styles/app.scss";

import App from "./app.jsx";
import Narratives from "./interface/Narratives.jsx"
import Share from "./interface/Share.jsx";
import Filter from "./interface/Filter.jsx";

class RouterComponent extends React.Component{
	render() {
		return (
		  	<Router>
		  		{/* https://github.com/rackt/react-router/issues/1531 */}
		    	<Route path="/" component={App} >
		    		<Route path="narrativelink" component={Narratives} />
		        	<Route path="sharelink" component={Share} />
		        	<Route path="filterlink/a" component={Filter} filter="a"/>
		        		<Route path="filterlink/b" component={Filter} filter="b" />
		        		<Route path="filterlink/c" component={Filter} filter="c" />
		        	
		    	</Route>
		  	</Router>
		)
	}
}

export default RouterComponent;