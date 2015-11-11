import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';

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
		    	<Route path="/" component={App}>
		    		<Route path="narrativelink" component={Narratives} />
		        	<Route path="sharelink" component={Share} />
		        	<Route path="filterlink" component={Filter} />
		    	</Route>
		  	</Router>
		)
	}
}

export default RouterComponent;