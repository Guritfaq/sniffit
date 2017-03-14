//
// var geohash = require('ngeohash');
// console.log(geohash.encode(42.5340843201,-71.2170562744,90));
// // prints ww8p1r4t8
//
// var latlon = geohash.decode('ww8p1r4t8');
// console.log(latlon.latitude);
// console.log(latlon.longitude);
exports.decode = decode;

console.log('tvtvt');
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
    return res ;
  })
  .catch(function(err) {
    console.log(err);
  });
}
