import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from "./app.jsx";
import Narratives from "./interface/overlays/narrative/narratives.jsx"
import Share from "./interface/overlays/Share.jsx";
import GoodsUI from "./interface/overlays/goods/goods-ui.jsx";
import Timeline from "./interface/timeline/timeline.jsx";

class RouterComponent extends React.Component{
	render() {
		return (
		  	<Router history={createBrowserHistory()}>
		    	<Route path="/" component={App} appState={this.state}>
		    		<IndexRoute component={Timeline} />
		    		<Route path="/narrativelink" component={Narratives} />
		        	<Route path="/sharelink" component={Share} />
		        	<Route path="/goods/:letter" component={GoodsUI} />
		    	</Route>
		  	</Router>
		);
	}
}

export default RouterComponent;