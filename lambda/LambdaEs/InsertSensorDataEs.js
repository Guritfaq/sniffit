'use strict';
var AWS = require('aws-sdk');
var common = require('./EsCommon.js');
var insertviolation = require('./InsertViolation.js');
var Thingsee = require('../Thingsee.js');
var docClient = new AWS.DynamoDB.DocumentClient();
var table = 'sensor_data'


var device_id ;
var dynamodb = new AWS.DynamoDB();
var client_id ;
var device_id ;
var job_id = "J002";
var id ;
var sensordata;
exports.handler = (event, context) => {
console.log(event);
sensordata = Thingsee.parsethingsee(event.body);
var hardware_vendor = "TNGS1";
var vendor_device_id = event.Deviceauthuuid;
console.log(vendor_device_id);
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
                console.log(err);
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
              data.Items.forEach(function(item) {
              client_id = item.client_id;
              device_id = item.device_uid;
              var ts = new Date(sensordata.timestamp).toISOString();
              id = client_id + job_id + device_id + ts;
              console.log('id ' + id);
              var paramsES = {
                              "client_id":  client_id,
                              "job_id":  job_id,
                              "device_id":  device_id,
                              "read_time": ts,
                              "temp":  sensordata.temp,
                              "battery":  sensordata.battery,
                              "speed": sensordata.speed,
                              "humidity":  sensordata.humidity,
                              "location":  sensordata.lat + ',' + sensordata.long,
                          };
                      console.log('paramsES ' + JSON.stringify(paramsES));
                      insertviolation.violation("T001",paramsES);
                      common.SendToEs('sniffitindex','sensor_reading',sensor_datamapping,paramsES,id,"INSERT",context);

            });
      }
 });
 }


var sensor_datamapping = {"mappings": {
    "sensor_data": {
      //"_all":       { "enabled": false  },
      "properties": {
        "client_id":    { "type": "keyword"  },
      //  "client_id_job_id_device_id":     { "type": "text"  },
        "job_id":      { "type": "keyword" },
        "device_id":    { "type": "keyword"  },
        "read_time":     { "type": "date" },
        "location":      {  "type": "geo_point" },
        "temp":    { "type": "double"  },
        "battery":     { "type": "double"  },
        "speed":      { "type": "double" } ,
        "humidity":      { "type": "double" }
      }
    }
  }
}
