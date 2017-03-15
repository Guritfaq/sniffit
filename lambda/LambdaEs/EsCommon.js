var elasticsearch = require('elasticsearch');
var http_aws_es = require('http-aws-es');
var AWS = require('aws-sdk');

var esDomain = {
    region: 'us-west-2',
    endpoint: 'search-monitoring-6c3m7xjtgbissriuef644ue2ae.us-west-2.es.amazonaws.com'//,
  //  index: 'job'//, doctype: 'apache'
};

var createIndex = function(es, table, callback) {
  console.log('createIndex', table);
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
function SendToEs(index,type,doc,id,eventname, context) {
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
        index: index
      },function(err, response, status){
        console.log('Looking for Index');
        console.log(err, response, status);
        if (status == 200) {
          console.log('Index Exists');
        //  resolve({es: es, domain: esDomain});
        } else if (status == 404) {
          createIndex(es, index, function(){
          //  resolve({es: es, domain: esDomain});
          });
        } else {
            console.log("status" +  status);
        }
      });

if (eventname == 'REMOVE')
{
    es.delete({
          index: index,
          type: type,
          id: id,
          refresh: true
        }, function (error, response) {
          context.succeed('Lambda added document ' + doc);
          console.log(response);
          console.log(error);
        });
}
else
{
      es.index({
            index: index,
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


}

function ReadFromEs(searchtext,index, context) {
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
          index: index,
        //  type: 'client_id',
          q: searchtext
        }, function (error, response) {
          // es.search({
          //   index: 'sensor_data',
          //   q: 'frozen'
          // }).then(console.log('here'););
          context.succeed(response);
          console.log(response);
          console.log(error);
});
}

exports.SendToEs = SendToEs;
exports.ReadFromEs = ReadFromEs;




// function FilteredSearch(request){
//
// var pageNum = request.params.page;
// var perPage = request.params.per_page;
// var userQuery = request.params.search_query;
// var userId = request.session.userId;
//
// var searchParams = {
//   index: 'job',
//   from: (pageNum - 1) * perPage,
//   size: perPage,
//   body: {
//     query: {
//       filtered: {
//         query: {
//           match: {
//             // match the query against all of
//             // the fields in the posts index
//             _all: userQuery
//           }
//         },
//         filter: {
//           // only return documents that are
//           // public or owned by the current user
//           or: [
//             {
//               term: { privacy: "public" }
//             },
//             {
//               term: { owner: request.userId }
//             }
//           ]
//         }
//       }
//     }
//   }
// };
// client.search(searchParams, function (err, res) {
//   if (err) {
//     // handle error
//     throw err;
//   }
// }
// }
