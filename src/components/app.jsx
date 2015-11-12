import React from "react";

import LeafletContainer from "./map/LeafletContainer.jsx";
import LeftMenu from "./interface/LeftMenu.jsx";
import Timeline from "./interface/Timeline.jsx";
import EventHandler from "./interface/EventHandler.jsx";

class App extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      time: 99584804
    };
  }
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