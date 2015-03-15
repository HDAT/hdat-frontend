'use strict';

// define the torque layer style using cartocss
var CARTOCSS = [
    'Map {',
    '-torque-time-attribute: "date";',
    '-torque-aggregation-function: "count(cartodb_id)";',
    '-torque-frame-count: 8000;',
    '-torque-animation-duration: 700;',
    '-torque-resolution: 2',
    '}',
    '#layer {',
    '  marker-width: 1;',
    '  marker-fill-opacity: 0.8;',
    '  marker-fill: #afb1f9; ',
    '  comp-op: "lighten";',
    '  [value > 2] { marker-fill: #FEC44F; }',
    '  [value > 3] { marker-fill: #FE9929; }',
    '  [value > 4] { marker-fill: #EC7014; }',
    '  [value > 5] { marker-fill: #CC4C02; }',
    '  [value > 6] { marker-fill: #993404; }',
    '  [value > 7] { marker-fill: #662506; }',
    '  [frame-offset = 1] { marker-width: 1; marker-fill-opacity: 0.5;}',
    '  [frame-offset = 2] { marker-width: 1; marker-fill-opacity: 0.05;}',
    '}'
].join('\n');
  
var map = new L.Map('map', {
  zoomControl: true,
  center: [10, 35],
  minZoom: 3,
  maxZoom: 6,
  zoom: 3,
  noWrap: false,
  attributionControl: false,
});
L.tileLayer('images/tiles/{z}/{x}/{y}.png', {
  tms: true
}).addTo(map);
var torqueLayer = new L.TorqueLayer({
      provider: 'sql_api',
      user       : 'ervazu',
      table      : 'testdata',
      column     : 'date',
      countby    : 'count(cartodb_id)',
      loop       : true,
      resolution: 1,
      steps: 9600,
      blendmode  : 'multiply',
      animationDuration: 800,
      map: map,
      cartocss: CARTOCSS
});
torqueLayer.addTo(map);
torqueLayer.play();

/* Test*/

  init_slider(torqueLayer);
    if(ui_enabled) {
      init_ui(map, torqueLayer);
    } else {
      var textarea = document.getElementById('code')
      textarea.parentNode.removeChild(textarea);
    }
    /* Dit werkt volgens mij nog niet */
    torqueLayer.on('change:bounds', function(changes) {
        var bounds = changes.bounds;
        var b = new L.Map.LatLngBounds(
          new L.Map.LatLng(
              bounds[0][0],
              bounds[0][1]
          ),
          new L.Map.LatLng(
            bounds[1][0],
            bounds[1][1]
          )
        )
        map.fitBounds(b);
    });
    torqueLayer.play();
  
 /**
 * inits slider and a small play/pause button
 */
function init_slider(torqueLayer) {
  var torqueTime = $('#torque-time');
  $("#torque-slider").slider({
      min: 0,
      max: torqueLayer.options.steps,
      value: 0,
      step: 1,
      slide: function(event, ui){
        var step = ui.value;
        torqueLayer.setStep(step);
      }
  });

  // each time time changes, move the slider
  torqueLayer.on('change:time', function(changes) {
    $("#torque-slider" ).slider({ value: changes.step });
    var month_year = changes.time.toString().substr(4).split(' ');
    console.log(month_year);
    torqueTime.text(month_year[0] + " - " + month_year[2]);
  });

  // play-pause toggle
  $("#torque-pause").click(function(){
    torqueLayer.toggle();
    $(this).toggleClass('playing');
  });
};