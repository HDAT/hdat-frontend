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


var geojsonFeature = [{
    "type": "Feature",
    "properties": {
        "novoyages": "2",
        "guldens": "30",
        "lichteguldens": "10"
    },
    "geometry": {
      "type":"LineString",
      "coordinates":[[101.890829466963,2.19709626205062],[102.519874896074,1.73960867724266],[103.41197568645,1.28212109243469],[103.560659151512,0.881819455727719],[104.026724628535,-0.015999929457914],[104.324091558661,-0.725105685910262],[104.552835351065,-1.33127673578082],[104.667207247267,-1.76588994134839],[105.044634504733,-2.22337752615635],[105.44493614144,-2.30343785349775],[105.788051830046,-2.64655354210372],[106.108293139412,-3.04685517881069],[106.096855949791,-3.36709648817627],[105.936735295109,-4.16769976159021],[105.96269615023,-4.43704363347225],[105.982484053589,-4.64234313082847],[105.882408644413,-5.84324804094939],[106.096362660175,-5.83462619684133],[106.362712409853,-5.82389292777063],[106.588662163044,-5.81478768363056],[107.046197544793,-5.79635008281572]]
    }},{
    "type": "Feature",
    "properties": {
        "novoyages": "6",
        "guldens": "30",
        "lichteguldens": "10"
    },
    "geometry": {"type":"LineString","coordinates":[[3.57396545619576,51.4600147160213],[2.40957167611742,51.5459126178304],[0.118960961209212,50.4196956830005],[-4.59240906784311,49.7593481485726],[-7.74334157494906,48.5575971458624],[-10.6817693315758,46.4618606411361],[-13.6385164632438,43.0691123834848],[-15.510756592466,38.8483283739662],[-17.1375170961347,34.7447883647119],[-17.8857582828566,32.2855689976858],[-18.2366795986135,31.1322076065649],[-19.4823971014228,25.0648305928818],[-21.3986037307442,17.5245758258771],[-21.2520487304137,12.446445064425],[-18.4125455990101,4.78894629715591],[-20.919221122431,0.873150917348737],[-21.0065691048601,0.73670053801734],[-24.8463101135195,-5.97551847711997],[-26.7441973677995,-11.2514984890183],[-26.5390203673368,-18.1249280045192],[-25.3665803646928,-23.5767740168141],[-20.7720811043313,-30.8898685333065],[-12.5723288358393,-34.7149540419328],[-3.5518685654965,-35.1839300429904],[5.14617070411921,-35.0080640425938],[17.0129143602468,-34.1787752844429],[18.3091729524126,-33.9150118060562],[18.2270983014336,-34.186031355559],[18.0774411908281,-34.6802156403829],[18.3388242996123,-35.3523436343994],[25.2328037937959,-37.6207756142053],[33.8677814947029,-38.3115738302778],[43.0441956352343,-38.3862547185019],[50.3535875701643,-38.2929036082218],[65.4157892138545,-38.3302440523339],[74.4615117999938,-37.8261480568214],[79.3251046455858,-36.6032485121525],[85.822341921079,-34.5681943080468],[92.4222654178804,-31.9263578871207],[97.4305524844064,-28.4630316957298],[103.526379985695,-24.4862743977986],[106.630304402508,-20.061431770523],[107.283762174468,-14.1523064897942],[106.891687511292,-7.92578743411319],[105.622112411483,-7.23498921804063],[104.949984417467,-6.73089322252822],[105.080675971859,-6.32014833729589],[105.882408644413,-5.84324804094939],[106.096362660175,-5.83462619684133],[106.362712409853,-5.82389292777063],[106.588662163044,-5.81478768363056],[107.046197544793,-5.79635008281572]]}
    }]
;

// var myStyle = {
//     "color": "#2fcdfc",
//     "opacity": 0.3
// };

L.geoJson(geojsonFeature, {
  style: function(feature) {
        return {weight: feature.properties.novoyages, "color": "#2fcdfc", opacity: 0.2, lineJoin: "round"};
        }
    
}).addTo(map);


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