console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var datetime = new Date().getTime().toString();
var uuid = require('node-uuid');


exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

var tableName = "client_device_map";
if (event.existing_client_id !== null)
{
var params = {
            TableName: "client_device_map",
               Key:{
                "client_id": {
                "S": event.existing_client_id},
                "device_uid":{
                 "S":event.device_uid }
                              }
        };
dynamodb.deleteItem(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {

                  console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                   context.succeed('Old device Delete successfull');
            }
        });

 }

 dynamodb.putItem({
            "TableName": tableName,
            "Item": {
                "client_id": {
                    "S": event.new_client_id
                },
                "device_uid": {
                    "S":  uuid.v1()
                },
                "hardware_vendor": {
                    "S":  event.hardware_vendor
                },
                "vendor_device_id": {
                    "S":  event.vendor_device_id
                },
                "status": {
                    "S":  event.status
                }
            }
        }, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('Add SUCCESS');
            }
        });

}
