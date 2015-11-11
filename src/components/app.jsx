import React from "react";

import LeafletContainer from "./map/LeafletContainer.jsx";
import LeftMenu from "./interface/LeftMenu.jsx";
  import Narratives from "./interface/Narratives.jsx"
	import Share from "./interface/Share.jsx";
	import Filter from "./interface/Filter.jsx";
import Timeline from "./interface/Timeline.jsx";
import EventHandler from "./interface/EventHandler.jsx";

class App extends React.Component{
  render() {
    return (
      <div>
        <LeftMenu />
        {this.props.children || <Timeline />}
        <EventHandler />
        <LeafletContainer />
      </div>
    )
  }
}

export default App;