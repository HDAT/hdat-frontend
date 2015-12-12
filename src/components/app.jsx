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
		console.log('changing product: ', selectedProduct);
		this.setState({selectedProduct: selectedProduct});
	}

  render() {
    return (
      <div className="app-container">
        <LeftMenu />
        {this.props.children && React.cloneElement(this.props.children, {changeProduct: this.changeProduct.bind(this)})}
        <MapElement selectedProduct={this.state.selectedProduct} />  
      </div>
    )
  }
}

export default App;