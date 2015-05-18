(function(L){

var southWest   = L.latLng(-75, 179),
    northEast   = L.latLng(75, -179),
    bounds      = L.latLngBounds(southWest, northEast);

var satellite   = L.tileLayer('https://{s}.tiles.mapbox.com/v4/erva.33c59435/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXJ2YSIsImEiOiJUNy1GUV84In0.YTqElwgLmBOW8higJ-9GIw', {id: 'satellite'}),
    geography   = L.tileLayer('images/tilesoverlay2/{z}/{x}/{y}.png', {id: 'geography'});
  
var map = new L.Map('map', {
  zoomControl:          true,
  center:               [10, 45],
  minZoom:              3,
  maxZoom:              6,
  zoom:                 3,
  maxBounds:            bounds,
  attributionControl:   false,
  inertia:              true,
  layers:               [satellite, geography]
});

L.Icon.Default.imagePath = 'images/leaflet';

var shipIcon = L.icon({
    iconUrl:                'images/hdat-shipicon.png',
    className:              'hdat-shipicon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10]   // icon center point
});

var blueIcon = L.icon({
    iconUrl:                'images/hdat-shipicon-blue.png',
    className:              'hdat-shipicon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10]   // icon center point
});

var orangeIcon = L.icon({
    iconUrl:                'images/hdat-shipicon-orange.png',
    className:              'hdat-shipicon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10]   // icon center point
});


// Check URI and create object of the query
var uri = new URI(window.location.href);
var uriQuery = uri.search(true);

console.log(uriQuery.firstCargo);
console.log(uriQuery.secondCargo);


var markerOptions = function(feature){
  // do something. I broke this thing, works now though
  // You can decide which marker should be assigned here.
  
  // console.log(feature)
  // console.log(feature.voyagedetails.inventory);

  // Zilver 1235 Goud 1048

  var nr = Math.round(Math.random());

  var firstProduct = false;
  var secondProduct = false;
  
  feature.voyagedetails.inventory.map(function(singleItem){
     if (singleItem == uriQuery.firstCargo){
        firstProduct = true;
     }
  })
  feature.voyagedetails.inventory.map(function(singleItem){
     if (singleItem == uriQuery.secondCargo){
        secondProduct = true;
     }
  })

  if (firstProduct){
    return {
      icon: blueIcon,
      getPopup: function(feature){
        return feature.voyagedetails.first_ship_name;
      }
    };
  } else if (secondProduct) {
    return {
      icon: orangeIcon,
      getPopup: function(feature){
        return feature.voyagedetails.first_ship_name;
      }
    };
  } else {
    return {
      icon: shipIcon,
      getPopup: function(feature){
        return feature.voyagedetails.first_ship_name;
      }
    };
  }
}

var playbackOptions = {
    playControl:            true,
    dateControl:            true,
    sliderControl:          true,
    tickLen:                (3600*24),
    tracksLayer:            false,
    maxInterpolationTime:   46464646464646,
    marker:                 markerOptions
};
var data, playback;

// Ajax shit 
var onDataCB = function () {
    if (ajax.readyState !== 4 || ajax.status !== 200) {
      return;
    }
    data = JSON.parse(ajax.responseText);
    playback = new L.Playback(map, data, null, playbackOptions);
};

var ajax = new XMLHttpRequest(); 
ajax.open('GET', 'data/json/voyages.json', true);
ajax.onreadystatechange = onDataCB;
ajax.send();

})(L);