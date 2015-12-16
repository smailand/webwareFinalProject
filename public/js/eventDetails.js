var userType = "";

function fetchDataForPage() {
  console.log('fetching data');

  participID = sessionStorage.getItem('participantID');
  creatorID = sessionStorage.getItem('creatorID');

  if (participID === null) {
    if (creatorID !== null) {
      userType = 'creator';
    }
  } else {
    if (creatorID === null) {
      userType = 'participant'
    } else {
      // uhhh.... shouldn't be here TODO
    }
  }


  // get details about event
  eventID = getURLParam(window.location, 'eventID');

  handleXMLHTTPGet('/getEventDetails', 'eventID=' + eventID, function(responseText) {
    console.log(responseText);

    // TODO parse event details
    serviceEvent = new EventDetails(eventID, 'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i');

    displayEvent(serviceEvent);
  });

  if (userType === 'creator') {
    // get list of signups for event
  } else {
    // check to see if user is signed up for this event
    // SAM TODO -- need new get... UserID and eventID, returns shift info
  }
}

function showButtonsForUser(typeOfUser) {
  optionButtons = document.getElementById('optionButtons');
  if (typeOfUser === 'creator') {
    optionButtons.innerHTML = '<button type="button" class="btn btn-primary">Edit Event</button>';
    optionButtons.innerHTML += '<button type="button" class="btn btn-danger">Danger</button>'
  }
}

function getURLParam(oTarget, sVar) {
  return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function displayEvent(serviceEvent) {
  eventHeading = document.getElementById('eventHeading');
  eventHeading.innerHTML = serviceEvent.eventName;
  eventPanel = document.getElementById('eventPanel');
  eventPanel.innerHTML = eventDetailsTemplate(serviceEvent);
}

function handleXMLHTTPGet(getFrom, queryString, callbackFunc) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:3000" + getFrom + '?' + queryString,
    "method": "GET",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b8241e93-87d3-1713-4188-5ec9c2653f79",
      "content-type": "application/x-www-form-urlencoded"
    }
  };

  $.ajax(settings).done(callbackFunc);
}

function EventDetails(eventID, eventName, eventDescription, eventStart, eventEnd, eventCapacity, recurrenceEventID, organizerName, organizerEmail) {
  this.eventID = eventID;
  this.eventName = eventName;
  this.eventDescription = eventDescription;
  this.eventStart = eventStart;
  this.eventEnd = eventStart;
  this.eventCapacity = eventCapacity;
  this.recurrenceEventID = recurrenceEventID;
  this.organizerName = organizerName;
  this.organizerEmail = organizerEmail;
}
