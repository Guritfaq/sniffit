'use strict';
var common = require('./EsCommon.js');

exports.handler = (event, context) => {
console.log(event);
common.ReadFromEs(event.searchtext,'sensor_data',context);
};
