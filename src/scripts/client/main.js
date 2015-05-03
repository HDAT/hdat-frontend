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
  maxZoom:              5,
  zoom:                 3,
  noWrap:               false,
  maxBounds:            bounds,
  attributionControl:   false,
  inertia:              true,
  worldCopyJump:        true,
  layers:               [satellite]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);

L.Icon.Default.imagePath = 'images/leaflet/';

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

var customIcon = L.icon({
    iconUrl:                'images/leaflet/customIcon.png',
    className:              'customIcon',
    iconSize:               [40, 40], // size of the icon
    iconAnchor:             [20, 20], // icon center point
    popupAnchor:            [70, 70] // point from which the popup should open relative to the iconAnchor
});

$(document).ajaxComplete(function(){            
    data = $.parseJSON(data.responseText); //Takes AJAX Reponse Text and parses it to JSON
    console.log(data[0].properties.time);


    var playbackOptions = {
        playControl:            true,
        dateControl:            true,
        sliderControl:          true,
        tickLen:                4000,
        maxInterpolationTime:   46464646464646,
        marker:                 function(){
                                    return { icon: customIcon }      
                                }     
    };
           
    var playback = new L.Playback(map, data, null, playbackOptions);
}); 


// Slider shit

// var slider = document.querySelector('.slider').addEventListener('input', function(e){
//   console.log(e.target.value);
//   if (e.target.value == 1755){
//     console.log('1755');
//   }
// });













// var PlotJourneys = function(name, data){
//   this.name = name;
//   this.data = data;
// };

// PlotJourneys.prototype.timeChanged = {
//   setCursors: function(){

//   },
//   addJourneys: function(){

//   },
//   destroyJourneys: function(){

//   },
//   compareJourneys: function(activeJourneys, newJourneys){  
  
//   },
//   getActiveJourneys: function(){
  
//   },
//   getJourneys: function(){
  
//   },
//   onChangeCallBack: function(){
//     var toBeAppendedJourneys = this.getJourney();    
//   }
// };

// PlotJourneys.prototype.initialise = {
//   getStartTime: function(journeys){
//     // start = somecalucaltion(journeys);
//     // return start;
//   },

//   getEndTime: function(journeys){
//     // end = somecalculation(journeys);
//     // return end;
//   },

//   appendSlider: function(start, end, onChangeCallBack){
//     // append(input, range, min, max).on('input', onchangeCallback)
//   },

//   initialiseInterface: function(){
//     // start = this.getStarttime();
//     // end = this.getEndtime();
//     // appendSlider(start, end, this.onchangeCallback)
//   },

//   initialiseApp: function(){
//     this.getData(initialiseInterface);
//   }
// };

// var BGB = new PlotJourneys();









