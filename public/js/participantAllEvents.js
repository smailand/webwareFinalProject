startDateRange = new Date();
endDateRange = getDateDaysAwayFromDate(startDateRange, 7);

console.log(startDateRange);
console.log(endDateRange);

userID = "";

function fetchDataForPage() {
  // get current date
  // get date 6 days from now
  userID = sessionStorage.getItem('participantID');

  getEventsInDateRange();
}

function displayAllEvents(listOfEvents) {
  if (listOfEvents.length !== 0) {
    eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = eventsTableTemplate();
    tableBody = document.getElementById('eventsTableBody');
    tableDataHTML = "";
    listOfEvents.forEach(function(p, i) {
      tableDataHTML += eventsTemplate(p);
    });

    tableBody.innerHTML = tableDataHTML;
  } else {
    eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = "";
    eventsPanelBody = document.getElementById('eventsPanelBody');
    eventsPanelBody.innerHTML = "No events to display";
  }

}

function showEventDetailPage(e) {
  if ((e.target.tagName === 'td') || (e.target.tagName === 'TD')) {
    rowID = e.target.parentElement.id;
  } else if ((e.target.tagName === 'tr') || (e.target.tagName === 'TR')) {
    rowID = e.target.id;
  } else {
    // uhhhhh ..... TODO
  }

  eventID = rowID.slice(5);
  window.location = '/participantEventDetails?eventID='+eventID;
}

function prevPage(e) {
  startDateRange = getDateDaysAwayFromDate(startDateRange, -7);
  endDateRange = getDateDaysAwayFromDate(endDateRange, -7);
  getEventsInDateRange();
}

function nextPage(e) {
  startDateRange = getDateDaysAwayFromDate(startDateRange, 7);
  endDateRange = getDateDaysAwayFromDate(endDateRange, 7);
  getEventsInDateRange();
}

function getEventsInDateRange() {
  handleXMLHTTPGet('/getEventsByDate', 'startDate=' + startDateRange.toISOString().substring(0, 10) + '&endDate=' + endDateRange.toISOString().substring(0, 10), function(response) {
    console.log(response);
    eventsList = [];

    for(i=0; i < response.length; i++){
        event = response[i];
        eventsList.push(new Event(event.event_id, event.event_name, event.start_time, event.end_time, event.user_name, event.user_email, new Date(event.start_time)));
    }

    // TODO get events from here
    // replace signups list here TODO
    displayAllEvents(eventsList);
  });
}

// should return the date x days away
// negative indicates days before
function getDateDaysAwayFromDate(originalDate, numDaysDifferent) {
    var copy = new Date();
    copy.setDate(copy.getDate() + numDaysDifferent);
    return copy;
}

function Event(eventID, eventName, eventStart, eventEnd, organizerName, organizerEmail, eventDate) {
  this.eventID = "event:" + eventID;
  this.eventName = eventName;
  this.eventStart = eventStart;
  this.eventEnd = eventEnd;
  this.organizerName = organizerName;
  this.organizerEmail = organizerEmail;
  this.eventDate = eventDate;
}
