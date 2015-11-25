import React from "react";

import LeafletContainer from "./map/LeafletContainer.jsx";
import LeftMenu from "./interface/left-menu.jsx";

class App extends React.Component{
  render() {
    return (
      <div>
        <LeftMenu />
        {this.props.children || React.cloneElement(this.props.children, {appState: this.props.route.appState})}
        <LeafletContainer />  
      </div>
    )
  }
}

export default App;