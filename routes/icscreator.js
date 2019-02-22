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
var mid = process.env.MID;

/* GET home page. */
router.post('/', function(req, res, next) {
  var eventTitle = eventDescription = eventLocation = eventStartDate = eventEndDate = icsStartYear = icsStartMonth = icsStartDay = icsStartHour = icsStartMinute = icsEndYear = icsEndMonth = icsEndDay = icsEndHour = icsEndMinute = encodedValue = assetId = assetName = assetMethod = assetPayload = assetUrl = '';

  assetId = req.body.assetId;
  eventTitle = req.body.eventTitle;
  eventDescription = req.body.eventDescription;
  eventLocation = req.body.eventLocation;
  eventStartDate = req.body.eventStartDate;
  eventEndDate = req.body.eventEndDate;

  icsStartYear = Number(eventStartDate.substring(0, 4));
  icsStartMonth = Number(eventStartDate.substring(5, 7));
  icsStartDay = Number(eventStartDate.substring(8, 10));
  icsStartHour = Number(eventStartDate.substring(11, 13));
  icsStartMinute = Number(eventStartDate.substring(14, 16));
  icsEndYear = Number(eventEndDate.substring(0, 4));
  icsEndMonth = Number(eventEndDate.substring(5, 7));
  icsEndDay = Number(eventEndDate.substring(8, 10));
  icsEndHour = Number(eventEndDate.substring(11, 13));
  icsEndMinute = Number(eventEndDate.substring(14, 16));

  ics.createEvent({
    start: [icsStartYear, icsStartMonth, icsStartDay, icsStartHour, icsStartMinute],
    end: [icsEndYear, icsEndMonth, icsEndDay, icsEndHour, icsEndMinute],
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
        client_secret: cs,
        account_id: mid
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
          'message': response.body.message,
          'reason': response.body.validationErrors[0].message
        });
      }
    });
  }
});

module.exports = router;
