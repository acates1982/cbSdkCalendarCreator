var buttonText = buttonColor = eventTitle = eventStart = eventEnd = eventDescription = eventLocation = assetId = assetUrl = '';

// Start Date Pickers
$("#eventStart").flatpickr({
   minDate: "today",
   enableTime: true,
  dateFormat: "Z",
  //  altInput: true,
  //  altFormat: "m/d/Y @ h:i K"
  //  dateFormat: "m/d/Y @ h:i K"
});
$("#eventEnd").flatpickr({
   minDate: "today",
   enableTime: true,
  dateFormat: "Z",
  //  altInput: true,
  //  altFormat: "m/d/Y @ h:i K"
});
// End Date Pickers

// Start Color Picker
$('#buttonColor').colorpicker({
  customClass: 'colorpicker-2x',
  sliders: {
    saturation: {
      maxLeft: 200,
      maxTop: 200
    },
    hue: {
      maxTop: 200
    },
    alpha: {
      maxTop: 200
    }
  }
});
// End Color Picker

// Start Field Checker
var fieldChecker = function() {
  if ($('#buttonText').val().length != 0 && $('#buttonColor').val().length != 0 && $('#eventTitle').val().length != 0 && $('#eventStart').val().length != 0 && $('#eventEnd').val().length != 0) {
    $('#buildContent').removeAttr("disabled");
  } else {
    $('#buildContent').attr("disabled", "");
  }
}
// End Field Checker

// Start Post ICS data to icscreator route
function buildContent() {
  $("#spinner").show();
  $("#creationAlert").hide();
  buttonText = $('#buttonText').val();
  buttonColor = $('#buttonColor').val();
  eventTitle = $('#eventTitle').val();
  eventStart = $('#eventStart').val();
  eventEnd = $('#eventEnd').val();
  eventDescription = $('#eventDescription').val();
  eventLocation = $('#eventLocation').val();

  var postData = {
    'eventTitle': eventTitle,
    'eventDescription': eventDescription,
    'eventLocation': eventLocation,
    'eventStartDate': eventStart,
    'eventEndDate': eventEnd,
    'assetId': assetId
  };
  // Start Ajax
  $.post('/icscreator/', postData, function(data) {})
    .done(function(data) {
      if (data.status == 'success') {
        assetName = data.assetName;
        assetId = data.assetId;
        assetUrl = data.assetUrl;
        $('#creationAlert').html(assetName + ' created with id: ' + assetId);
        $("#creationAlert").addClass("slds-text-color_success");
        $("#creationAlert").removeClass("slds-text-color_error");
          $("#spinner").hide();
        $("#creationAlert").show();
        blockContent();
      } else {
        reason = data.reason;
        $('#creationAlert').html('ICS creation error: ' + reason);
        $("#creationAlert").removeClass("slds-text-color_success");
        $("#creationAlert").addClass("slds-text-color_error");
          $("#spinner").hide();
        $("#creationAlert").show();
      }
    })
    .fail(function(data) {
      $('#creationAlert').html('ICS creation error: check your configuration');
      $("#creationAlert").removeClass("slds-text-color_success");
      $("#creationAlert").addClass("slds-text-color_error");
        $("#spinner").hide();
      $("#creationAlert").show();
    })
  // End Ajax
}
// End Post ICS data to icscreator route

///////////////////
// End SDK logic
///////////////////

var sdk = new window.sfdc.BlockSDK();

function blockSettings() {
  $('#buttonText').val(buttonText);
  $('#buttonColor').val(buttonColor);
  $('#eventTitle').val(eventTitle);
  $('#eventStart').val(eventStart);
  $('#eventEnd').val(eventEnd);
  $('#eventDescription').val(eventDescription);
  $('#eventLocation').val(eventLocation);
}

function blockContent() {
//20190222T190000Z/20190222T200000Z
gcalStart = moment(eventStart).format('YYYY') + moment(eventStart).format('MM') + moment(eventStart).format('DD') + 'T' + moment(eventStart).format('HH') + moment(eventStart).format('mm') + moment(eventStart).format('ss');
console.log(gcalStart);
gcalEnd = moment(eventEnd).format('YYYY') + moment(eventEnd).format('MM') + moment(eventEnd).format('DD') + 'T' + moment(eventEnd).format('HH') + moment(eventEnd).format('mm') + moment(eventEnd).format('ss');
console.log(gcalEnd);
gcalLink = 'http://www.google.com/calendar/event?action=TEMPLATE&dates=' + gcalStart + '%2F' + gcalEnd + '&text=' + encodeURIComponent(eventTitle) + '&location=' + encodeURIComponent(eventLocation) + '&details=' + encodeURIComponent(eventDescription);
console.log(gcalLink);
/*
  <table align="center">
    <tr>
      <td style="font-family: Gotham, Helvetica, Arial, sans-serif; padding: 20px 0px;" width="90%">
        <a alias="Add To Calendar" href="http://image.s4.exct.net/lib/fe92157473650c7a77/m/1/c9246837-99da-49ec-8600-e40c14df6f2c.ics" style="font-family: Gotham, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none;" target="_blank" class="gmail-hide"><span style="display: block; color: #ffffff; text-align: center; padding: 10px 10px; border-radius: 20px; background-color:#0070d2;">ICS - Save The Date</span></a>
        <a alias="Add To Calendar" href="http://www.google.com/calendar/event?action=TEMPLATE&dates=20190220T040000Z%2F20190220T050000Z&text=Healthcare%20Webinar&location=Online&details=some%20details" style="font-family: Gotham, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; display:none;" target="_blank" class="gmail-show"><span style="display:block; color: #ffffff; text-align: center; padding: 10px 10px; border-radius: 20px; background-color:#0070d2;">GMAIL - Save The Date</span></a>
      </td>
    </tr>
  </table>
*/
// ICS Only
/*
  sdk.setContent('<table align="center"><tr><td style="font-family: Gotham, Helvetica, Arial, sans-serif; padding: 20px 0px;" width="90%"><a alias="Add To Calendar" href="' + assetUrl + '" style="font-family: Gotham, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none;" target="_blank"><span style="display: block; color: #ffffff; text-align: center; padding: 10px 10px; border-radius: 20px; background-color: ' + buttonColor + ';">' + buttonText + '</span></a></td></tr></table>');
*/

  sdk.setContent('<table align="center"><tr><td style="font-family: Gotham, Helvetica, Arial, sans-serif; padding: 20px 0px;" width="90%"><a alias="Add To Calendar" href="' + assetUrl + '" style="font-family: Gotham, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none;" target="_blank" class="gmail-hide"><span style="display: block; color: #ffffff; text-align: center; padding: 10px 10px; border-radius: 20px; background-color:' + buttonColor + ';">' + buttonText + '</span></a><a alias="Add To Calendar" href="' + gcalLink + '" style="font-family: Gotham, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; display:none;" target="_blank" class="gmail-show"><span style="display:block; color: #ffffff; text-align: center; padding: 10px 10px; border-radius: 20px; background-color:' + buttonColor + ';">' + buttonText + 'e</span></a></td></tr></table>');

  sdk.setData({
    buttonText: buttonText,
    buttonColor: buttonColor,
    eventTitle: eventTitle,
    eventStart: eventStart,
    eventEnd: eventEnd,
    eventDescription: eventDescription,
    eventLocation: eventLocation,
    assetId: assetId,
    assetUrl: assetUrl
  });
}

sdk.getData(function(data) {
  buttonText = data.buttonText || '';
  buttonColor = data.buttonColor || '#0070d2';
  eventTitle = data.eventTitle || '';
  eventStart = data.eventStart || '';
  eventEnd = data.eventEnd || '';
  eventLocation = data.eventLocation || '';
  eventDescription = data.eventDescription || '';
  assetId = data.assetId || '';
  assetUrl = data.assetUrl || '';
  blockSettings();
//  blockContent();
});

///////////////////
// End SDK logic
///////////////////

// Start Event Handlers
$('#buildContent')
  .click(buildContent)

$('#buttonText, #buttonColor, #eventTitle, #eventStart, #eventEnd, #eventDescription, #eventLocation')
  .keyup(fieldChecker)
  .keypress(fieldChecker)
  .blur(fieldChecker)
  .change(fieldChecker)
  .keydown(fieldChecker)
// End Event Handlers
