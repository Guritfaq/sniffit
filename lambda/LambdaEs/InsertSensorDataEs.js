'use strict';
var AWS = require('aws-sdk');
var common = require('./EsCommon.js');
var docClient = new AWS.DynamoDB.DocumentClient();
var table = 'sensor_data'

var temp ;
var lat ;
var long ;
var humidity;
var pressure;
var speed;
var device_id ;
var timestamp ;
var battery ;
var dynamodb = new AWS.DynamoDB();
var datetime = new Date().getTime().toString();
var client_id ;
var device_id ;
var job_id = "J009";
var id ;


exports.handler = (event, context) => {
console.log(event);

traverse(event);

var hardware_vendor = "TNGS1";
var vendor_device_id = event.Deviceauthuuid; //"1234567890";
console.log(vendor_device_id);
//timestamp = new Date().getTime().toString();
GetClient_Device_Map(vendor_device_id,hardware_vendor,context);

}

function GetJob(client_id,device_id,context)
{
  var params = {
            TableName: "job",
            IndexName: "client_id-devices-index",
            KeyConditionExpression: "#client_id = :client_id AND #device_id = :device_id",
            ExpressionAttributeNames:{
                "#client_id": "client_id","#device_id": "device_id"
            },
            ExpressionAttributeValues: {
                ":client_id": client_id,":device_id": device_id
            }
        };
        docClient.query(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
              data.Items.forEach(function(item) {
              job_id = item.job_id;
            });
            }
 });
 }
function GetClient_Device_Map(vendor_device_id,hardware_vendor,context)
{
  var params = {
            TableName: "client_device_map",
            IndexName: "hardware_vendor-vendor_device_id-index",
            KeyConditionExpression: "#hardware_vendor = :hardware_vendor AND #vendor_device_id = :vendor_device_id",
            ExpressionAttributeNames:{
                "#hardware_vendor": "hardware_vendor","#vendor_device_id": "vendor_device_id"
            },
            ExpressionAttributeValues: {
                ":hardware_vendor": hardware_vendor,":vendor_device_id": vendor_device_id
            }
        };
        console.log(params);
docClient.query(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
              data.Items.forEach(function(item) {
              client_id = item.client_id;
              device_id = item.device_uid;
              console.log(timestamp);
              var ts = new Date(timestamp);
              console.log(ts);
              ts = ts.toISOString();
              console.log(ts);
              id = client_id + job_id + device_id + ts;
              console.log('id ' + id);
              var paramsES = {
                              "client_id":  client_id,
                              "client_id_job_id_device_id":  "C001J001D001" ,  //event.client_id_job_id_device_id,
                              "job_id":  "J002",
                              "device_id":  device_id,
                              "read_time":  ts,
                              "location":  lat + ',' + long ,
                              "temp":  temp,
                              "battery":  battery,
                              "speed": speed,
                              "humidity":  humidity
                          };
                      paramsES =  JSON.stringify(paramsES, null, 2);
                      console.log('paramsES ' + paramsES);
                      common.SendToEs('sensor_data_new3','sensor_reading',sensor_datamapping,paramsES,id,"INSERT",context);


            });
            }
 });
 }


function traverse(o) {

    for (var i in o)
{
console.log(i);
        if (o[i] !== null && typeof(o[i])=="object")
{
              if (i== "engine")
              {
                  var engine = o[i];
                  for (var j in engine)
                  {
                    if  (j == "ts")
                    {
                    timestamp = engine[j];
                    break;
                    }
                  }
              }
         if (i== "senses")
              {
                  var senses = o[i];
                  for (var j in senses)
                  {
                      var sense = senses[j];
switch(sense.sId) {
    case "0x00060100":
        temp = sense.val;
        break;
    case "0x00010100":
        lat =  sense.val;
        break;
    case "0x00010200":
        long =  sense.val;
        break;
    case "0x00020100":
        speed =  sense.val;
        break;
    case "0x00030200":
        battery =  sense.val;
        break;
    case "0x00060200":
        humidity =  sense.val;
        break;
}
              }
        }
            traverse(o[i]);
    }
}
}
var sensor_datamapping = {"mappings": {
    "sensor_data": {
      "_all":       { "enabled": false  },
      "properties": {
        "client_id":    { "type": "text"  },
        "client_id_job_id_device_id":     { "type": "text"  },
        "job_id":      { "type": "text" },
        "device_id":    { "type": "text"  },
        "read_time":     { "type": "date" },
        "location":      {  "type": "geo_point" },
        "temp":    { "type": "double"  },
        "battery":     { "type": "double"  },
        "speed":      { "type": "double" } ,
        "humidity":      { "type": "double" }
      }
    }
  }
};
