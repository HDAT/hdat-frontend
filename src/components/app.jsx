import React from "react";

import MapElement from "./map/map-element.jsx";
import LeftMenu from "./interface/left-menu.jsx";

class App extends React.Component{
  render() {
    return (
      <div className="app-container">
        <LeftMenu />
        {this.props.children || React.cloneElement(this.props.children, {appState: this.props.route.appState})}
        <MapElement />  
      </div>
    )
  }
}

export default App;