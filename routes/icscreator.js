var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const ics = require('ics');
const base64 = require('base-64');
const utf8 = require('utf8');
const moment = require('moment');
const request = require("request");

var ci = process.env.CLIENTID || "giygenu6a4704ba8cwh5h4nj";
var cs = process.env.CLIENTSECRET || "66mw3jfwQsqzVpvqSiHitP16";
var sd = process.env.SUBDOMAIN || 'mcmtwjynv76zg4b73149z7yzw5mm';
var icsFolder = process.env.ICSFOLDERID || '876667';

/* GET home page. */
router.post('/', function(req, res, next) {
  var eventTitle = eventDescription = eventLocation = eventStartDate = eventEndDate = icsStartYear = icsStartMonth = icsStartDay = icsStartHour = icsStartMinute = icsEndYear = icsEndMonth = icsEndDay = icsEndHour = icsEndMinute = encodedValue = assetId = assetName = assetMethod = assetPayload = assetUrl = '';

  assetId = req.body.assetId;
  eventTitle = req.body.eventTitle;
  eventDescription = req.body.eventDescription;
  eventLocation = req.body.eventLocation;
  eventStartDate = req.body.eventStartDate;
  eventEndDate = req.body.eventEndDate;

  icsStartYear = moment(eventStartDate).format('YYYY');
  icsStartMonth = moment(eventStartDate).format('M');
  icsStartDay = moment(eventStartDate).format('D');
  icsStartHour = moment(eventStartDate).format('H');
  icsStartMinute = moment(eventStartDate).format('m');
  icsEndYear = moment(eventEndDate).format('YYYY');
  icsEndMonth = moment(eventEndDate).format('M');
  icsEndDay = moment(eventEndDate).format('D');
  icsEndHour = moment(eventEndDate).format('H');
  icsEndMinute = moment(eventEndDate).format('m');

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
      console.log(encodedValue);
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
        console.log("assetUrl: " + assetUrl);
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
});

module.exports = router;
