console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var datetime = new Date().getTime().toString();
var docClient = new AWS.DynamoDB.DocumentClient();
var   haspwd;
exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    password(event.pwd).hash(function(error, hash) {
        if(error)
            throw new Error('Something went wrong!');
        haspwd  = hash;
        console.log( haspwd);

    });

      var userid;
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
            } else
            {
             data.Items.forEach(function(item) {
             userid = item.user_id;
             });
    }});

if (event.status == undefined)
statusaction = "DELETE";
else
statusaction = "PUT";

console.log(event);
//var attribeup =

var updateparams = {
                TableName: "user",
                Key: {
                "client_id": {
                "S": event.client_id},
                "user_id":{
                 "S":"1" }
                    },
                "AttributeUpdates":
                {
                   'status':{"Value":{"S":event.status},"Action":statusaction},
                    "login_id":{"Value":{"S":event.login_id},"Action":"PUT"},
                    "first_name":{"Value":{"S":event.first_name},"Action":"PUT"},
                    "last_name":{"Value":{"S":event.last_name},"Action":"PUT"},
                     "pwd":{"Value":{"S":haspwd},"Action":"PUT"},
                     "logged_in_ip":{"Value":{"S":event.logged_in_ip},"Action":"PUT"},
                     "phone":{"Value":{"S":event.phone},"Action":"PUT"},
                     "name_prefix":{"Value":{"S":event.name_prefix},"Action":"PUT"}
                },
                "ReturnValues":"UPDATED_NEW"};

dynamodb.updateItem(updateparams, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('SUCCESS');
            }
        });
}
