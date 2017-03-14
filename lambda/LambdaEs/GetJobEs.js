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
console.log(event);
ReadFromEs(event.searchtext,context);

};

function ReadFromEs(searchtext, context) {
      var myCredentials = new AWS.EnvironmentCredentials('AWS');
  var es = elasticsearch.Client({
        hosts: esDomain.endpoint,
        connectionClass: http_aws_es,
        amazonES: {
          region: esDomain.region,
          credentials: myCredentials
        }
      });



    es.search({
          index: 'job',
        //  type: 'client_id',
          q: searchtext
        }, function (error, response) {
          // es.search({
          //   index: 'job',
          //   q: 'frozen'
          // }).then(console.log('here'););
          context.succeed(response);
          console.log(response);
          console.log(error);
});


}



function FilteredSearch(request){

var pageNum = request.params.page;
var perPage = request.params.per_page;
var userQuery = request.params.search_query;
var userId = request.session.userId;

var searchParams = {
  index: 'job',
  from: (pageNum - 1) * perPage,
  size: perPage,
  body: {
    query: {
      filtered: {
        query: {
          match: {
            // match the query against all of
            // the fields in the posts index
            _all: userQuery
          }
        },
        filter: {
          // only return documents that are
          // public or owned by the current user
          or: [
            {
              term: { privacy: "public" }
            },
            {
              term: { owner: request.userId }
            }
          ]
        }
      }
    }
  }
};
client.search(searchParams, function (err, res) {
  if (err) {
    // handle error
    throw err;
  }
}
}
