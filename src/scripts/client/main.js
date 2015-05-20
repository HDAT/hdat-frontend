(function(L){

var southWest   = L.latLng(-75, 179),
    northEast   = L.latLng(75, -179),
    bounds      = L.latLngBounds(southWest, northEast);

var satellite   = L.tileLayer('images/tiles/baselayer/{z}/{x}/{y}.png', {id: 'satellite'}),
    geography   = L.tileLayer('images/tiles/overlay/{z}/{x}/{y}.png', {id: 'geography'});
  
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

// var defaultIconSettings = function() { return {
//     className:              'hdat-shipicon',
//     iconSize:               [20, 20],   // size of the icon
//     iconAnchor:             [10, 10]   // icon center point
// }};

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

var pinkIcon = L.icon({
    iconUrl:                'images/hdat-shipicon-pink.png',
    className:              'hdat-shipicon',
    iconSize:               [20, 20],   // size of the icon
    iconAnchor:             [10, 10]   // icon center point
});

// var slider = document.querySelector('.selectspeed').addEventListener('input', function(e){
//     playback.setSpeed(e.target.value);
// });


// Check URI and create object of the query
var uri = new URI(window.location.href);
var uriQuery = uri.search(true);

var markerOptions = function(feature){
  // do something. I broke this thing, works now though
  // You can decide which marker should be assigned here.
  
  // console.log(feature)
  // console.log(feature.voyagedetails.inventory);

  // Zilver 1235 Goud 1048

var firstProduct = false,
    secondProduct = false,
    thirdProduct = false;
  
feature.voyagedetails.inventory.map(function(singleItem){
    if (singleItem == uriQuery.firstCargo){
        firstProduct = true;
    }
    if (singleItem == uriQuery.secondCargo){
        secondProduct = true;
    }
    if (singleItem == uriQuery.thirdCargo){
        thirdProduct = true;
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
  } else if (thirdProduct) {
    return {
      icon: pinkIcon,
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