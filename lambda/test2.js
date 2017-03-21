var https = require('https');
var DateDiff = require('date-diff');

var violationJSON = {};
var key = 'violations';
violationJSON[key] = [];

var data = {
    type : 'temp',
    value: 34
};
violationJSON[key].push(data);


var data = {
    type : 'humidity',
    value: 10
};
violationJSON[key].push(data);


console.log(JSON.stringify(violationJSON));
