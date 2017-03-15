console.log('Loading event');
var AWS = require('aws-sdk');
var password = require('password-hash-and-salt');
var uuid = require('node-uuid');
var dynamodb = new AWS.DynamoDB();
var datetime = new Date().getTime().toString();

password('mysecret').hash(function(error, hash) {
    if(error)
        throw new Error('Something went wrong!');
        haspwd = hash;
}

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

var tableName = "user";
var   haspwd;
password(event.pwd).hash(function(error, hash) {
    if(error)
        throw new Error('Something went wrong!');
    haspwd  = hash;
    console.log( haspwd);

});

var params = {
            "TableName": tableName,
            "Item": {
                "client_id": {
                    "S": event.client_id
                },
		"user_id": {
                    "S":  event.user_id
                },
                "first_name": {
                    "S":  event.first_name
                },
		"last_name": {
                    "S":  event.last_name
                },
		"pwd": {
                    "S":  haspwd
                },
		"email": {
                    "S":  event.email
		},
		"login_id": {
                    "S":  event.login_id
                },
		"status": {
                    "S":  event.status
                },
		"phone": {
                    "S":  event.phone
                },
		"logged_in_ip": {
                    "S":  event.logged_in_ip
                },
		"name_prefix": {
                    "S":  event.name_prefix
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
