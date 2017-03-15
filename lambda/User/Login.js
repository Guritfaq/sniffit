var password = require('password-hash-and-salt');
//var backendpwd = "pbkdf2$10000$2524ef68cab48c764f67845d7570afc78144b942130cf7269de56e1f67810b8a43bdb3eaf23a8a226ec000503de02942a12634a2d4a1cfdf4920249571a410869$4748d7751bc0bf2a1dbdfc1e0ab9535b9677c61485ea04c4a5cb466f36c36380dfc6360c22ed1d3470f62a8d1e9b8460addd011f9fadc492a5c154b789a69b43";
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var pwd;

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
          data.Items.forEach(function(item) {
             pwd = item.pwd;
             });
        password(event.pwd).verifyAgainst(pwd, function(error, verified) {
            if(error)
                console.log ('Something went wrong!');
            if(!verified) {
                console.log("Login Failed");
            } else {
                console.log("Login successfull");
            }
          });
           context.succeed("success");
        }
    });

    }
