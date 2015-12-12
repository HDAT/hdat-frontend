import { Map } from 'react-leaflet';
import LeafletPlayback from '../../../assets/scripts/LeafletPlayback.js';

import voyages from '../../../assets/data/map/playback/voyages.json';
import playbackOptions from './playback-config.js';

class MapWithVoyages extends Map {
	componentDidMount(){	
		super.componentDidMount();
		this.leafletMap = this.getLeafletElement();
		var playback = new LeafletPlayback(this.leafletMap, voyages, null, playbackOptions);
	}
}

export default MapWithVoyages;