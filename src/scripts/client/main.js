'use strict';

var southWest   = L.latLng(-70, 179),
    northEast   = L.latLng(70, -179),
    bounds      = L.latLngBounds(southWest, northEast);

var satellite   = L.tileLayer('https://{s}.tiles.mapbox.com/v4/erva.33c59435/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXJ2YSIsImEiOiJUNy1GUV84In0.YTqElwgLmBOW8higJ-9GIw', {id: 'satellite'}),
    geography   = L.tileLayer('images/tilesoverlay/{z}/{x}/{y}.png', {id: 'geography'});

/* Basiskaart */
var baseMaps = {
    "Satellite": satellite,
};

/* Optionele kaart, hier moet later routing network in */
var overlayMaps = {
    "Geography": geography
};
  
var map = new L.Map('map', {
  zoomControl:          true,
  center:               [10, 35],
  minZoom:              3,
  maxZoom:              6,
  zoom:                 3,
  noWrap:               false,
  maxBounds:            bounds,
  attributionControl:   false,
  inertia:              true,
  worldCopyJump:        true,
  layers:               [satellite, geography]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);

L.Icon.Default.imagePath = 'images/leaflet/';

var customIcon = L.icon({
    iconUrl:                'images/leaflet/customIcon.png',
    className:              'customIcon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10],   // icon center point
    popupAnchor:            [10, 10]    // point from which the popup should open relative to the iconAnchor
});

var data;           
$(document).ready(function(){       
    $.ajax({
        type: 'GET',
        url: 'data/json/voyages.json',
        data: { get_param: 'value'},
        dataType: 'json',
        complete: function(gotdata){
            data = gotdata;
        }
    });
});

$(document).ajaxComplete(function(){            
    data = $.parseJSON(data.responseText); //Takes AJAX Reponse Text and parses it to JSON
    var playbackOptions = {
        playControl:            true,
        dateControl:            true,
        sliderControl:          true,
        tickLen:                (3600*24),
        tracksLayer:            false,
        maxInterpolationTime:   46464646464646,
        marker:                 function(){
                                    return { icon: customIcon }      
                                }     
    };
           
    var playback = new L.Playback(map, data, null, playbackOptions);
}); 
