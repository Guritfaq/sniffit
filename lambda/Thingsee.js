
var temp ;
var lat ;
var long ;
var humidity;
var pressure;
var speed;
var device_id ;
var timestamp ;
var battery ;

function parsethingseeJSON(o) {
    for (var i in o)
{
        if (o[i] !== null && typeof(o[i])=="object")
{
              if (i== "engine")
              {
                  var engine = o[i];
                  for (var j in engine)
                  {
                    if  (j == "ts")
                    {
                    timestamp = engine[j];
                    break;
                    }
                  }
              }
         if (i== "senses")
              {
                  var senses = o[i];
                  for (var j in senses)
                  {
                      var sense = senses[j];
switch(sense.sId) {
    case "0x00060100":
        temp = sense.val;
        break;
    case "0x00010100":
        lat =  sense.val;
        break;
    case "0x00010200":
        long =  sense.val;
        break;
    case "0x00020100":
        speed =  sense.val;
        break;
    case "0x00030200":
        battery =  sense.val;
        break;
    case "0x00060200":
        humidity =  sense.val;
        break;
}
              }
        }
            parsethingseeJSON(o[i]);
    }
}

}

function parsethingsee (o)
{
parsethingseeJSON(o);
return  { "temp" :temp,
"humidity" :humidity,
"pressure" :pressure,
"speed" :speed,
"battery" :battery ,
"lat" : lat,
"long" : long,
"timestamp" : timestamp
}

}
exports.parsethingsee = parsethingsee;
