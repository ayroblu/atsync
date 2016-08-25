var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs')
  , util = require('util')
  , parse = require('csv-parse')
  , _ = require('lodash')

var mongoUrl = 'mongodb://localhost:27017/atdata';

function readFile(){
  var file = fs.readFileSync('routes.txt')
  parse(file, {}, function(err, csvrows){
    var columns = csvrows.splice(0,1)[0];
    var rows = csvrows.map(r=>{
      return _.zipObject(columns, r)
    })
    insertRoutes(rows)
  })
}
readFile()


function insertRoutes(data){
  var runQuery = function(db, data, callback) {
    db.collection('routes').drop()
    db.collection('routes').insert(data, function(err, result) {
      assert.equal(err, null);
      console.log("Inserted documents into the routes collection.");
      callback();
    });
  };
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    runQuery(db, data, function() {
      db.close();
    });
  });
}

