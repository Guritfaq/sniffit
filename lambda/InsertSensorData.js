console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

    var temp ;
    var lat ;
    var long ;
    var humidity;
    var pressure;
    var speed;
    var device_id ;
    var timestamp ;
    var client_id ;
    var device_id ;
    var battery ;
function traverse(o) {

    for (var i in o)
{

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
docClient.query(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log(data);
              data.Items.forEach(function(item) {
              client_id = item.client_id;
              device_id = item.device_uid;

            });
            }
 });
 }

exports.handler = function(event, context) {


var hardware_vendor = "TNGS1";
var vendor_device_id = "1234567890";
//GetClient_Device_Map("","",context);
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

docClient.query(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log(data);
              data.Items.forEach(function(item) {
              client_id = item.client_id;
              device_id = item.device_uid;
              timestamp = new Date(timestamp).toISOString()
            });
            console.log(client_id);
console.log(device_id);
           // context.succeed('efedededewfqrfwd')
            }
 });


var tableName = "sensor_data";
dynamodb.putItem({
            "TableName": tableName,
            "Item": {
              "client_id": {
                  "S": client_id
              },
              "client_id_job_id_device_id": {
                  "S":  "C001J001D001" //event.client_id_job_id_device_id
              },
              "job_id": {
                    "S": "J002"
                },
                "device_id": {
                    "S": device_id
                },
              "read_time": {
                  "S": timestamp
              },
              "location": {
                  "S":  lat +  "," + long
              },
              "temp": {
                  "N": temp
              },
              "battery": {
                  "N": battery
              },
              "speed": {
                  "N": speed
              },
              "humidity": {
                  "N": humidity
              }
            }
        }, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('SUCCESS');
            }
        });
}
