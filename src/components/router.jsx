import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from "./app.jsx";
import ShipViewer from "./interface/ship-viewer/ship-viewer.jsx"
import GoodsUI from "./interface/goods/goods-ui.jsx";
import MinardInfo from "./interface/minard/minard-info.jsx";
import Graph from "./interface/graph/graph.jsx";
import Events from "./interface/events/events.jsx";
import Share from "./interface/share/share.jsx";
import Timeline from "./interface/timeline/timeline.jsx";

class RouterComponent extends React.Component{
	render() {
		return (
	  	<Router history={createBrowserHistory()}>
	    	<Route path="/" component={App}>
	    		<IndexRoute component={Timeline} />
	    		<Route path="/ships" component={ShipViewer} />
	        <Route path="/goods/:letter" component={GoodsUI} />
	    		<Route path="/minard" component={MinardInfo} />
	    		<Route path="/graph" component={Graph} />
	    		<Route path="/events" component={Events} />
	        <Route path="/share" component={Share} />
	    	</Route>
	  	</Router>
		);
	}
}

export default RouterComponent;