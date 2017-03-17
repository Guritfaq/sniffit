'use strict';
var common = require('./EsCommon.js');

exports.handler = (event, context) => {
console.log(event);
var searchparam ={"query": {
      "match": {
        "client_id": event.client_id
      },
          "query_string": {
           "query": event.searchtext
          }
        }
      };
common.ReadFromEs(searchparam,'sensor_data',context);
};
