var sleep = require('sleep');

// var uuid = require('node-uuid');
// var password = require('password-hash-and-salt');
//function abc() {
 // var totalCharacters = 39; // length of number hash; in this case 0-39 = 40 characters
 // var txtUuid = "";
 // do {
 //   var point = Math.floor(Math.random() * 10);
 //   if (txtUuid.length === 0 && point === 0) {
 //     do {
 //       point = Math.floor(Math.random() * 10);
 //     } while (point === 0);
 //   }
 //   txtUuid = txtUuid + point;
 // } while ((txtUuid.length - 1) < totalCharacters);
 //


 //
 // function timeConverter(UNIX_timestamp){
 //   var a = new Date(UNIX_timestamp * 1000);
 //   var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 //   var year = a.getFullYear();
 //   var month = months[a.getMonth()];
 //   var date = a.getDate();
 //   var hour = a.getHours();
 //   var min = a.getMinutes();
 //   var sec = a.getSeconds();
 //   var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
 //   return time;
 // }


 // var utcSeconds = 1489360297044;
 // var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
 // d.setUTCSeconds(utcSeconds);



//var d = new Date(1489528549428).toISOString()
//console.log(  password("admin"));


var datetime = new Date(1489360297044).toISOString();

console.log(datetime);


// var datamapping = {"mappings": {
//     "sensor_data": {
//       "_all":       { "enabled": false  },
//       "properties": {
//         "client_id":    { "type": "text"  },
//         "client_id_job_id_device_id":     { "type": "text"  },
//         "job_id":      { "type": "text" },
//         "device_id":    { "type": "text"  },
//         "read_time":     { "type": "date" },
//         "location":      {  "type": "geo_point" },
//         "temp":    { "type": "double"  },
//         "battery":     { "type": "double"  },
//         "speed":      { "type": "double" } ,
//         "humidity":      { "type": "double" }
//       }
//     }}};

  //console.log(sensor_datamapping);

  //
  // var searchparam ={"query": {
  //       "match": {
  //         "client_id": event.client_id
  //       },
  // 					"query_string": {
  // 					 "query": event.searchtext
  // 					}
  // 				}};
  //   console.log(searchparam);

//abc('event','context');

function abc (event, context) {
  console.log('before createjob');
  createjob(event, context);
  console.log('after createjob');

  }


      exports.abcd = abcd;

      function abcd()
      { return "abcde";}

  function createjob(event, context)
  {
    sleep.sleep(2);
    console.log('inside createjob');
  }

  function createviolation(event,context)
  {
  console.log('createviolation');
  }

  function createjobcallback(event,context) {
    console.log('inside createjobcallback');
  createviolation(event,context);
  //  createviolation(event,context);
         }
