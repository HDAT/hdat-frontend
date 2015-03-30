// To run this script:
// node src/scripts/build/postgesql-test.js

'use strict';

var pg = require('pg');
var conString = "postgres://root:secret@localhost/bgb";
var query = '';

//The code that does the connecting to the DB
pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }















  client.query(query, function(err, result) {
    //call `done()` to release the client back to the pool
    done();
    if(err) {
      return console.error('error running query', err);
    }

    console.log(result);


  });












  client.end();
});

// Howmany points on line
// var amountOfPoints = 100;

// Creating table and loading all voyages
// CREATE TABLE

// SELECT * FROM "allVoyages" WHERE "id"="'id'";

// result.forEach(function(){
//  for(i < amountOfPoints){
//    mutatedResult.push()
//  }
// });

// Entering the shit back into SQL
// INSERT INTO "reallyAllVoyagePoints"
// SELECT 
//  "voyID",
//  "coord",
//  "timeStamp";

// Done