import React from 'react';
import { Link } from 'react-router';

class Share extends React.Component{
	render() {
		return(
			<div className="share">
				<h2>Share</h2>
				<p>Bladiebladiebla</p>
				<h2>Embed</h2>
				<p>You can also embed this map on a website. This way you can even include certain traderoutes. 
					<br/><br/>
				Use the following piece of code to embed HDAT.</p>
				<Link to="/"><p>Close</p></Link>
			</div>
		)
	}
}

export default Share;