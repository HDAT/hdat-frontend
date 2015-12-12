import React from "react";

import MapElement from "./map/map-element.jsx";
import LeftMenu from "./interface/left-menu.jsx";

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selectedProduct: 0
		}
	}

	changeProduct(selectedProduct){
		this.setState({selectedProduct: selectedProduct});
	}

  render() {
    return (
      <div className="app-container">
        <LeftMenu productHandler={this.changeProduct} />
        {this.props.children || React.cloneElement(this.props.children, {appState: this.props.route.appState})}
        <MapElement selectedProduct="1000"/>  
      </div>
    )
  }
}

export default App;