var https = require('https');

var optionsget = {
  hostname: 'maps.googleapis.com',
  port: 443,
  path: '/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=43.6655101,-73.8918896999999&key=AIzaSyB17mk5jlXsZSKz4Rv4kjaSXe0-f3dHctM',
  method: 'GET'
};

var reqGet = https.request(optionsget, function(res) {
    res.on('data', function(d) {
   process.stdout.write(d);
    });
});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});


// console.log(outpt.rows[0].elements[0].distance.text);
// console.log(outpt.rows[0].elements[0].duration.text);
//var a = JSON.parse(outpt.temp);
//console.log (a.min);``
