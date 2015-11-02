import React from "react";
import { Router, Route, Link } from 'react-router';
import LeafletContainer from "./map/LeafletContainer.jsx";
import LeftMenu from "./interface/LeftMenu.jsx";
  import Narratives from "./interface/Narratives.jsx"
	import Share from "./interface/Share.jsx";
	import Filter from "./interface/Filter.jsx";
import Timeline from "./interface/Timeline.jsx";

import ReactDOM from 'react-dom';
import "babel/polyfill";
import "../styles/app.scss";


const App = React.createClass({
  render() {
    return (
        <div>
	        <LeftMenu />
	        {this.props.children || <Timeline />}
	        <LeafletContainer />
        </div>
    )
  }
})

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
    	  <Route path="narrativelink" component={Narratives} />
        <Route path="sharelink" component={Share} />
        <Route path="filterlink" component={Filter} />
    </Route>
  </Router>
), document.body)