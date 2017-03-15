console.log('Loading event');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

  var params = {
            TableName: "user",
            IndexName: "client_id-login_id-index",
            KeyConditionExpression: "#client_id = :client_id AND #login_id = :login_id",
            ExpressionAttributeNames:
            {
                "#client_id": "client_id","#login_id": "login_id"
            },

            ExpressionAttributeValues: {
                ":client_id": event.client_id ,":login_id": event.login_id}
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
