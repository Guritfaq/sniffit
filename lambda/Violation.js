var AWS = require('aws-sdk');
var converter = require('aws-sdk/lib/dynamodb/converter.js');
var https = require('https');
var DateDiff = require('date-diff');
var docClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();
var table = 'violation';
var violationJSON = {}; // empty Object
// var key = 'L';
// violationJSON[key] = [];

function addviolation(paramsES,threshholds)
{

if (threshholds.temp != undefined && threshholds.temp.enable ==  true)
  if ((paramsES.temp != undefined) && (paramsES.temp <= threshholds.temp.min ||  paramsES.temp >= threshholds.temp.max))
    {
      // var data = {
      //     "type" : {"S":'temp'},
      //     "value": {"S":paramsES.temp}
      // };
      // violationJSON[key].push(data);
      violationJSON.temp = {"S" : paramsES.temp.toString()};
    }
  if (threshholds.humidity != undefined && threshholds.humidity.enable ==  true)
    if ((paramsES.humidity != undefined) && (paramsES.humidity <= threshholds.humidity.min ||  paramsES.humidity >= threshholds.humidity.max))
    {
            violationJSON.humidity = {"S" : paramsES.humidity.toString()};
    }
    if (threshholds.pressure != undefined && threshholds.pressure.enable ==  true)
      if ((paramsES.pressure != undefined) && (paramsES.pressure <= threshholds.pressure.min ||  paramsES.pressure >= threshholds.pressure.max))
      {
        violationJSON.pressure = {"S" : paramsES.pressure.toString()};
      }
      if (threshholds.battery != undefined && threshholds.battery.enable ==  true)
        if ((paramsES.battery != undefined) && (paramsES.battery <= threshholds.battery.min))
        {
          violationJSON.battery = {"S" : paramsES.battery.toString()};
        }
  //  any other parameters add here.
    if (threshholds.dest != undefined && threshholds.source != undefined && threshholds.start_time != undefined && threshholds.end_time != undefined)
      if (paramsES.location != undefined)
      {
        var unit ;
        if (threshholds.dist_unit == "m")
        unit = "imperial";
        else
        unit = "metric";
        console.log(paramsES.read_time);
        estimatedesttime(paramsES.location , threshholds.dest.lat + "," + threshholds.dest.long ,unit, paramsES.read_time,paramsES);
      }
}
function estimatedesttime(loc , dest , unit,end_time,paramsES)
{
  var optionsget = {
    hostname: 'maps.googleapis.com',
    port: 443,
  //  path: '/maps/api/distancematrix/json?units=' + unit + '&origins=' + loc +'&destinations=' + dest +'&key=AIzaSyB17mk5jlXsZSKz4Rv4kjaSXe0-f3dHctM',
  path: '/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=43.6655101,-73.8918896999999&key=AIzaSyB17mk5jlXsZSKz4Rv4kjaSXe0-f3dHctM',
    method: 'GET'
  };
  var reqGet = https.request(optionsget, function(res) {
      res.on('data', function(d) {
      var output = JSON.parse(d);
      console.log(JSON.stringify(output));
      var response = parsegoogleres(output,end_time);
      console.log(JSON.stringify(response));
      if (response.diff > 0)
      {
        violationJSON.delay = {"S" :response.diff.toString()};
      }
      console.log(JSON.stringify(violationJSON));
      insertviolationindynamo(paramsES,violationJSON);
      });
  });

  reqGet.end();
  reqGet.on('error', function(e) {
      console.error(e);
  });

}

function parsegoogleres(response,end_time){
  var dist = response.rows[0].elements[0].distance.text;
  var time = response.rows[0].elements[0].duration.text;
  var timesec = response.rows[0].elements[0].duration.value;
  console.log(end_time);
  var parsedDate = new Date(Date.parse(end_time));
  console.log(parsedDate);
  console.log(timesec);
  var newexpectedarrival = new Date(parsedDate+ (1000 * timesec));
    console.log(newexpectedarrival);
  var diff = new DateDiff(parsedDate, newexpectedarrival);
  console.log(diff);
  // // diff.years(); // ===> 1.9
  // // diff.months(); // ===> 23
  // diff.days(); // ===> 699
  // diff.weeks(); // ===> 99.9
  // diff.hours(); // ===> 16776
  // diff.minutes(); // ===> 1006560
  // diff.seconds(); // ===> 60393600

return {
      "newexpectedarrival" : newexpectedarrival,
      "dist" : dist,
      "timetodest" : time,
      "diff" : diff.difference
  }
}
  function checkviolation(template_id,paramsES)
  {
     getthreshholds(template_id,paramsES);
  }

 function insertviolationindynamo(paramsES,violationJSON)
  {

    var params = {
               "TableName": "violation",
               "Item": {
                 "client_id_job_id_device_id": {
                     "S": paramsES.client_id + paramsES.job_id + paramsES.device_id
                   },
                   "client_id": {
                       "S": paramsES.client_id
                   },
                   "job_id": {
                       "S":  paramsES.job_id
                   },
                   "device_id": {
                       "S":  paramsES.device_id
                   },
                   "read_time": {
                       "S":  paramsES.read_time
                   },
                   "status": {
                       "S":  "new"
                   },
                   "violations": {
                       "M": violationJSON
                     }
                   }
               };
           console.log('insertviolation params');
           console.log(JSON.stringify(params));
    dynamodb.putItem(params, function(err, data) {
               if (err) {
                  console.log(err);
               } else {
                   console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
               }
           });
  }
function getthreshholds(template_id,paramsES)
{
  var params = {
          "RequestItems" : {
              "job_template": {
                "Keys" : [
                  {"client_id" : { "S" : paramsES.client_id } ,
                   "template_id" : { "S" : template_id }
                 }
                ]
              },
              "job": {
                 "Keys" : [
                  {"client_id" : { "S" : paramsES.client_id },
                   "job_id" : { "S" : paramsES.job_id }
                 }
                ]
              }
            }
          };
        dynamodb.batchGetItem(params, function(err, data) {
            if (err) {
                console.log(err);
            } else {  console.log('data for getthreshholds');
          var source ;
          var dest ;
                      if (data.Responses.job[0].source == undefined)
                          source = data.Responses.job[0].source;
                      else {
                          source = data.Responses.job_template[0].source;     }

                          if (data.Responses.job[0].dest == undefined)
                              dest = data.Responses.job[0].dest;
                          else {
                              dest = data.Responses.job_template[0].dest;     }
                      threshholds =
                      {
                        "temp" :   converter.output(data.Responses.job_template[0].temp),
                        "humidity" :   converter.output(data.Responses.job_template[0].humidity),
                        "pressure" :   converter.output(data.Responses.job_template[0].pressure),
                        "source" :   source,
                        "dest" :   dest,
                        "start_time" :   data.Responses.job[0].start_time,
                        "end_time" :   data.Responses.job[0].end_time,
                        "dist_unit" : data.Responses.job_template[0].dist_unit,
                        "temp_unit" : data.Responses.job_template[0].temp_unit
                      };
                      console.log(JSON.stringify(threshholds));
                      addviolation(paramsES,threshholds);
              }
          });
}
 exports.checkviolation = checkviolation;
