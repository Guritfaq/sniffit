exports.decode = decode;

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyB17mk5jlXsZSKz4Rv4kjaSXe0-f3dHctM', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

// Using callback
// geocoder.geocode('25 Nile St Billerica MA 01821', function(err, res) {
//   console.log(res);
// });

function decode(){
  geocoder.reverse({lat:30.806030, lon:74.785416})
  .then(function(res) {
    console.log(res);
    //return res ;
  })
  .catch(function(err) {
    console.log(err);
  });
}
