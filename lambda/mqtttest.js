var mqtt = require('mqtt')


var authStr = accountAuthUuid + ':' + accountAuthToken;
var client = mqtt.connect('ws://'' + authStr + '@api.thingsee.com:3003');

   client = mqtt.connect('http://127.0.0.1:1883');

   client.on("message", function(topic, payload, pck) {
     console.log("new message",topic, payload, pck);
   });

   client.on("connect", function() {
     console.log("connected");
   });

   client.on("error", function(error) {
     console.log("error", error);
   });

   client.on("offline", function() {
     console.log("offline");
   });

   client.on("connect", function() {
     console.log("connected");
     client.subscribe('/7a2ad920-06c2-11e7-be9a-7b548e47ebb9/events');
   });
