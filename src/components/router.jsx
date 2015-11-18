import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from "./app.jsx";
import Narratives from "./interface/overlays/Narratives.jsx"
import Share from "./interface/overlays/Share.jsx";
import GoodsUI from "./interface/overlays/goods/goods-ui.jsx";

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
		  	<Router history={createBrowserHistory()}>
		    	<Route path="/" component={App} appState={this.state}>
		    		<Route path="/narrativelink" component={Narratives} />
		        	<Route path="/sharelink" component={Share} />
		        	<Route path="/goods/:letter" component={GoodsUI} />
		    	</Route>
		  	</Router>
		)
	}
}

export default RouterComponent;