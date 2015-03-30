// To run this script:
// node src/scripts/build/mysql-test.js

'use strict';

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     	: 'localhost',
  database	: 'bgb',
  user		: 'root',
  password	: 'secret'
});

var query = 'SELECT * FROM tempCargoSumYear';

connection.connect();





connection.query(query, function(err, rows, fields) {
  if (err) throw err;

  console.log('Some product is: ', rows);
});





connection.end();


