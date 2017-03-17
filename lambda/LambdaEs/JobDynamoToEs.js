'use strict';
var common = require('./EsCommon.js');
var converter = require('aws-sdk/lib/dynamodb/converter.js');

exports.handler = (event, context) => {
    event.Records.forEach((record) => {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log(record.dynamodb);
        console.log(record);
        var evntObj = { "M": {} };
              if (record.eventName == "REMOVE")
              { evntObj.M = record.dynamodb.OldImage;}
              else
              { evntObj.M = record.dynamodb.NewImage;}
               var outpt = converter.output(evntObj);
               var id = outpt.client_id + outpt.job_id;
              var jsonDoc = JSON.stringify(outpt, null, 2);
              console.log('jsonDoc' + jsonDoc);
              common.SendToEs('sniffitindex','job',job_datamapping,jsonDoc,id,record.eventName,context);
    });

  //  callback(null, `Successfully processed ${event.Records.length} records.`);

};

var job_datamapping = {"mappings": {
    "job": {
      //"_all":       { "enabled": false  },
      "properties": {
        "client_id":    { "type": "keyword"  },
        "job_id":     { "type": "keyword"  },
        "name":      { "type": "text" },
        "type":    { "type": "keyword"  },
        "desc":     { "type": "text" },
        "source":      {  "type": "geo_point" },
        "dest":    { "type": "geo_point"  },
        "devices":     { "type": "object"  },
        "status":      { "type": "keyword" } ,
        "start_time":      { "type": "date" },
        "end_time":      { "type": "date" }
      }
    }
  }
};
