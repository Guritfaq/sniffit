console.log('Loading event');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

var datetime = new Date().getTime().toString();



exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

  var params = {
            TableName: "client_device_map",
            IndexName: "client_id-index",
            KeyConditionExpression: "#client_id = :client_id",
            ExpressionAttributeNames:{
                "#client_id": "client_id"
            },
            ExpressionAttributeValues: {
                ":client_id": event.client_id
            }
        };
docClient.query(params, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
               // console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed(data);


            }
        });
}
