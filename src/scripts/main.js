'use strict';

(function(L){
	var map = L.map('map').setView([0, 0], 3);
	L.tileLayer('images/tiles/{z}/{x}/{y}.png', {
	    minZoom: 3,
	    maxZoom: 6,
	    attributionControl: false,
	    tms: true,
	    noWrap: true
	}).addTo(map);
}(L));