// To run this script:
// node src/scripts/build/postgesql-test.js

'use strict';

var pg = require('pg');
var conString = "postgres://root:secret@localhost/bgb";

// You can type a single query here. Chaining multiple is more interesting however.
var query = [
  'SELECT * FROM "bgbPlace"',
  'SELECT * FROM "bgbCargo"'
];


//The code that does the connecting to the DB
pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }

  query.forEach(function(ArrValue, Arrkey, ArrWhatever){
    client.query(ArrValue, function(err, result) {
      //call `done()` to release the client back to the pool
      done();
      if(err) {
        return console.error('error running query', err);
      }

      // Logging out results
      result.rows.forEach(function(value, index, array){
      	console.log(value);
      });
    });
  });

  client.end();
});