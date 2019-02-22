var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const ics = require('ics');
const base64 = require('base-64');
const utf8 = require('utf8');
const moment = require('moment');
const request = require("request");

var ci = process.env.CLIENTID;
var cs = process.env.CLIENTSECRET;
var sd = process.env.SUBDOMAIN;
var icsFolder = process.env.ICSFOLDERID;

console.log(ci);
console.log(cs);
console.log(sd);
console.log(icsFolder);

/*
var ci = 'm79e9qfq0lfkclgebcf4qo81';
var cs = 'xTdRNlXJOL1SwzHctAUwRsBX';
var sd = 'mcm8zxc2qn3b1jytd-92rtgj1s44';
var icsFolder = '882808';
*/
/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("ics creator called...")
  var eventTitle = eventDescription = eventLocation = eventStartDate = eventEndDate = icsStartYear = icsStartMonth = icsStartDay = icsStartHour = icsStartMinute = icsEndYear = icsEndMonth = icsEndDay = icsEndHour = icsEndMinute = encodedValue = assetId = assetName = assetMethod = assetPayload = assetUrl = '';

  assetId = req.body.assetId;
  eventTitle = req.body.eventTitle;
  eventDescription = req.body.eventDescription;
  eventLocation = req.body.eventLocation;
  eventStartDate = req.body.eventStartDate;
  eventEndDate = req.body.eventEndDate;
  console.log("event start: " + eventStartDate);
  console.log("event end: " + eventEndDate);

  icsStartYear = eventStartDate.substring(0, 4);
  icsStartMonth = eventStartDate.substring(5, 7);
  icsStartDay = eventStartDate.substring(8, 10);
  icsStartHour = eventStartDate.substring(11, 13);
  icsStartMinute = eventStartDate.substring(14, 16);
  icsEndYear = eventEndDate.substring(0, 4);
  icsEndMonth = eventEndDate.substring(5, 7);
  icsEndDay = eventEndDate.substring(8, 10);
  icsEndHour = eventEndDate.substring(11, 13);
  icsEndMinute = eventEndDate.substring(14, 16);
  console.log("start year: " + icsStartYear);
  console.log("start month: " + icsStartMonth);
  console.log("start day: " + icsStartDay);
  console.log("start hour: " + icsStartHour);
  console.log("start min: " + icsStartMinute);
  console.log("end year: " + icsEndYear);
  console.log("end month: " + icsEndMonth);
  console.log("end day: " + icsEndDay);
  console.log("end hour: " + icsEndHour);
  console.log("end min: " + icsEndMinute);

  ics.createEvent({
//    start: [icsStartYear, icsStartMonth, icsStartDay, icsStartHour, icsStartMinute],
//    end: [icsEndYear, icsEndMonth, icsEndDay, icsEndHour, icsEndMinute],
    start: [2019, 2, 22, 18, 30],
    end: [2019, 2, 22, 19, 30],
    title: eventTitle,
    description: eventDescription,
    location: eventLocation
  }, (error, value) => {
    if (error) {
      console.log(error)
    } else {
      var utf8Value = utf8.encode(value);
      encodedValue = base64.encode(utf8Value);
      getToken();
    }
  })

  function getToken() {
    var tokenOptions = {
      method: 'POST',
      url: 'https://' + sd + '.auth.marketingcloudapis.com/v2/token',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        grant_type: 'client_credentials',
        client_id: ci,
        client_secret: cs
      },
      json: true
    };

    function parseResponse(error, response, body) {
      if (!error && response.statusCode == 200) {
        token = response.body.access_token;
        createUpdateCalendar(token);
      } else {
        console.log('token request error...')
        console.log(error);
      }
    }
    request(tokenOptions, parseResponse);
  }

  function createUpdateCalendar(t) {
    token = t;
    if (assetId.length == 0) {
      assetUrl = 'https://' + sd + '.rest.marketingcloudapis.com/asset/v1/content/assets';
      assetMethod = 'POST';
      assetPayload = '{"name": "' + eventTitle + '","assetType": {"name": "ics","id": 111},"category": { "id": ' + icsFolder + ' },"file":"' + encodedValue + '"}';
    } else {
      assetUrl = 'https://' + sd + '.rest.marketingcloudapis.com/asset/v1/content/assets/' + assetId;
      assetMethod = 'PATCH';
      assetPayload = '{"name": "' + eventTitle + '","file":"' + encodedValue + '"}';
    }
    var assetOptions = {
      method: assetMethod,
      url: assetUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.parse(assetPayload),
      json: true
    };
    request(assetOptions, function(error, response, body) {
      if (!error && response.statusCode == 201 || response.statusCode == 200) {
        assetId = response.body.id;
        assetName = response.body.name;
        assetUrl = response.body.fileProperties.publishedURL;
        res.send({
          'status': 'success',
          'assetName': assetName,
          'assetId': assetId,
          'assetUrl': assetUrl
        });
      } else {
        console.log('asset creation error...');
        console.log(error);
        res.send({
          'status': 'error',
          'reason': response.body.message
        });
      }
    });
  }
  res.send({
    'status': 'success'
  });
});

module.exports = router;
