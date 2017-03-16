console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var datetime = new Date().getTime().toString();


exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

var params = {
                TableName: "client_device_map",
                Key: {
                "client_id": {
                "S": event.client_id},
                "device_uid":{
                 "S":event.device_uid }
                    },
                "AttributeUpdates":{"status":{"Value":{"S":event.status},"Action":"PUT"}},
    //            "Expected":{"AttributeName3":{"Value":{"S":"AttributeValue3_Current"}}},
                "ReturnValues":"UPDATED_NEW"};

dynamodb.updateItem(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('SUCCESS');
            }
        });
}
