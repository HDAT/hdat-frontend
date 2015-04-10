'use strict';

var southWest = L.latLng(-70, 179),
    northEast = L.latLng(70, -179),
    bounds = L.latLngBounds(southWest, northEast);
  
var map = new L.Map('map', {
  zoomControl: true,
  center: [10, 35],
  minZoom: 3,
  maxZoom: 5,
  zoom: 3,
  noWrap: false,
  maxBounds: bounds,
  attributionControl: false,
  inertia: true,
  worldCopyJump: true,
});
L.tileLayer('images/tiles/{z}/{x}/{y}.png', {
  tms: true
}).addTo(map);

L.Icon.Default.imagePath = "images/leaflet";

// var line = L.polyline([[40.68510, -73.94136],[40.68576, -73.94149],[40.68649, -73.94165]]),
//     animatedMarker = L.animatedMarker(line.getLatLngs());

// map.addLayer(animatedMarker);

var line = L.polyline([[52, 4.35], [52, 4.35], [-6.1830555, 106.83667]]),
    animatedMarker = L.animatedMarker(line.getLatLngs(), {
  distance: 10971174,  // meters
  interval: 5000, // milliseconds
});

map.addLayer(animatedMarker);
