console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var datetime = new Date().getTime().toString();


exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

var tableName = "job";

var params = {
            "TableName": tableName,
            "Item": {
                "client_id": {
                    "S": event.client_id
                },
		"job_id": {
                    "S":  event.job_id
                },
                "name": {
                    "S":  event.name
                },
		"type": {
                    "S":  event.type
                },
		"desc": {
                    "S":  event.desc
                },
                "source": {
                                "M":  {"lat": { "N": event.source.lat } ,
                                       "lng":{"N": event.source.lng} }
            		},
            		"dest": {
                                "M": {"lat": { "N":  event.dest.lat } ,
                                       "lng":{"N": event.dest.lng} }
            		        },
                "devices": {
                                "M": { "device" : { "M":
                                  {"device_id": { "S":  event.devices.device.device_id } } }
                                }
                              },
		"status": {
                    "S":  event.status
                },
		"start_time": {
                    "S":  event.start_time
                },
		"end_time": {
                    "S":  event.end_time
                }



            }
        };

 dynamodb.putItem(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('Add SUCCESS');
            }
        });

}
