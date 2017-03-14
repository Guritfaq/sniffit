'use strict';
var AWS = require('aws-sdk');
var path = require('path');
var elasticsearch = require('elasticsearch');
var http_aws_es = require('http-aws-es');
var converter = require('aws-sdk/lib/dynamodb/converter.js');
var esDomain = {
    region: 'us-west-2',
    endpoint: 'search-monitoring-6c3m7xjtgbissriuef644ue2ae.us-west-2.es.amazonaws.com',
    index: 'job'//, doctype: 'apache'
};
var endpoint = new AWS.Endpoint(esDomain.endpoint);
exports.handler = (event, context) => {
    event.Records.forEach((record) => {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log(record);
        var evntObj = { "M": {} };
               evntObj.M = record.dynamodb.NewImage;
               var outpt = converter.output(evntObj);
               var id = outpt.client_id + outpt.job_id;
              var jsonDoc = JSON.stringify(outpt, null, 2);
console.log('jsonDoc' + jsonDoc);
              postToES(jsonDoc,id,context);

    });

  //  callback(null, `Successfully processed ${event.Records.length} records.`);

};

var createIndex = function(es, table, callback) {
  console.log('createIndex', "job");
  es.indices.create({
    index: table
  }, function(err, response, status){
    if (err) {
      console.log("Index could not be created", err, response, status);
    } else {
      console.log("Index has been created");
    }
  });

};
function postToES(doc,id, context) {
      var myCredentials = new AWS.EnvironmentCredentials('AWS');
  var es = elasticsearch.Client({
        hosts: esDomain.endpoint,
        connectionClass: http_aws_es,
        amazonES: {
          region: esDomain.region,
          credentials: myCredentials
        }

      });

      es.indices.exists({
        index: "job"
      },function(err, response, status){
        console.log('Looking for Index');
        console.log(err, response, status);
        if (status == 200) {
          console.log('Index Exists');
        //  resolve({es: es, domain: esDomain});
        } else if (status == 404) {
          createIndex(es, "job", function(){
          //  resolve({es: es, domain: esDomain});
          });
        } else {
            console.log("status" +  status);
        }
      });

console.log("before index");
    es.index({
          index: 'job',
          type: 'client_id',
          id: id,
          body: doc,
          refresh: true
        }, function (error, response) {
          context.succeed('Lambda added document ' + doc);
          console.log(response);
          console.log(error);
});


}
