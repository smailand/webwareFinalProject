var userType = "";
shiftsList = [];
creatorShiftsList = [];
eventID = "";

serviceEvent = "";

timeslots = [];

console.log("shifts");

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
    responseText = responseText[0]
    console.log(responseText.event_id)

    // TODO parse event details
    date = new Date();
    startTime = date.toISOString().substring(11, 19);
    endTime = date.toISOString().substring(11, 19);
    serviceEvent = new EventDetails(responseText.event_id, responseText.event_name, responseText.event_description, responseText.start_time.substring(11, 19), responseText.end_time.substring(11, 19), 'f', 'g', 'h', 'i', responseText.start_time.substring(0, 10));

    displayEvent(serviceEvent);
  });

  showButtonsForUser(userType);

  if (userType === 'creator') {
    // get list of signups for event
    //function CreatorViewSignup(eventID, shiftID, eventName, eventStart, eventEnd, participantName, participantEmail, approvalStatus)

    getAllShiftData();

  } else {
    updateAndDisplaySignups();
  }
}

function getAllShiftData() {
  handleXMLHTTPGet('/getAllShiftsByEventId', 'eventId=' + eventID, function(response) {

    console.log("HERERER");
    console.log(response);

    shiftsList = [];

    for (i = 0; i < response.length; i++) {
      shift = response[i];
      shiftsList.push(new CreatorViewSignup(shift.event_id, shift.shift_id, shift.event_name, shift.start_time, shift.end_time, shift.user_name, shift.user_email, shift.approval_status));
    }


    showCreatorSignupsTable(shiftsList);

  });
}

function showButtonsForUser(typeOfUser) {
  optionButtons = document.getElementById('optionButtons');
  if (typeOfUser === 'creator') {
    //optionButtons.innerHTML = '<button type="button" class="btn btn-primary">Edit Event</button>';
    optionButtons.innerHTML += '<button type="button" class="btn btn-danger" onclick="deleteEvent()">Delete Event</button>'
    detailsPanel = document.getElementById("details");
    detailsPanel.hidden = false;
  }
  // else {
  //   optionButtons.innerHTML = '<button type="button" class="btn btn-primary" onclick="showSignupsPanel()">Sign Up</button>';
  // }
}

function updateAndDisplaySignups() {
  handleXMLHTTPGet('/getTimeSlotByEventId', 'eventID=' + eventID, function(responseText) {
    timeslots = responseText;
    handleXMLHTTPGet('/getMySignUpsByEventId', 'eventID=' + eventID + '&userID=' + sessionStorage.getItem('participantID'), function(responseText2) {
      console.log('mysignups')
      console.log(responseText2);
      if (responseText2 === 'ERROR: Email Not on File') {
        shiftsList = [];
      } else {

        shiftsList = responseText2;
      }
      removeDeniedSignups(shiftsList);
      removeSignupsFromList(shiftsList, timeslots);
      showShiftsTable(shiftsList);
      showSignupsPanel();

    });
  });
}


function showShiftsTable(shiftsList) {
  console.log(shiftsList.length)
  if (shiftsList.length !== 0) {
    sidePanel = document.getElementById('signupsPanel');
    sidePanel.innerHTML = "";

    sidePanelTitle = document.getElementById('sidePanelTitle');
    sidePanelTitle.innerHTML = 'Your Shifts';
    eventsTable = document.getElementById('oldSignupsTable');
    eventsTable.innerHTML = userShiftsTableTemplate();
    tableDataHTML = "";

    tableBody = document.getElementById('myShiftsTableBody');

    shiftsList.forEach(function(p, i) {
      console.log(tableDataHTML);
      tableDataHTML += userShiftsTemplate(p);
    });


    tableBody.innerHTML = tableDataHTML;
    detailsPanel = document.getElementById("existingDetails");
    detailsPanel.hidden = false;
  } else {
    detailsPanel = document.getElementById("existingDetails");
    detailsPanel.hidden = true;
  }
}

function getURLParam(oTarget, sVar) {
  return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function displayEvent(serviceEvent) {
  eventHeading = document.getElementById('eventHeading');
  eventHeading.innerHTML = serviceEvent.eventName;
  eventPanel = document.getElementById('eventPanel');
  eventPanel.innerHTML = eventDetailsTemplate(serviceEvent) + eventPanel.innerHTML;
}

function EventDetails(eventID, eventName, eventDescription, eventStart, eventEnd, eventCapacity, recurrenceEventID, organizerName, organizerEmail, eventDate) {
  this.eventID = eventID;
  this.eventName = eventName;
  this.eventDescription = eventDescription;
  this.eventStart = eventStart;
  this.eventEnd = eventEnd;
  this.eventCapacity = eventCapacity;
  this.recurrenceEventID = recurrenceEventID;
  this.organizerName = organizerName;
  this.organizerEmail = organizerEmail;
  this.eventDate = eventDate;
}

// all should be strings
function Signup(eventID, shiftID, eventName, eventStart, eventEnd, approvalStatus, organizerName, organizerEmail) {
  this.signupId = "event:" + eventID + ";shift:" + shiftID;
  this.eventName = eventName;
  this.eventStart = eventStart;
  this.eventEnd = eventEnd;
  this.approvalStatus = approvalStatus;
  this.organizerName = organizerName;
  this.organizerEmail = organizerEmail;
}

function removeSignup(e) {

  console.log('remvoe signup')
  removeBtn = e.target;
  parent = removeBtn.parentElement;
  rowID = e.target.parentElement.parentElement.id;

  console.log(rowID)
  signupID = rowID.slice(6);
  console.log(signupID)
  if (showRemoveAlert()) {
    //shiftIDs.forEach(function(p, i) {
    var deleteID = {
      userID: sessionStorage.getItem('participantID'),
      shiftID: signupID
    }
    handleXMLHTTPPost('/cancelSignUp', deleteID, function(responseText) {
      console.log(responseText);
      updateAndDisplaySignups()
    });
    //})
  }
}

function parseRowId(rowID) {
  signupsToRemove = [];
  rowIDWithoutModifier = rowID.slice(6);
  console.log(rowIDWithoutModifier);
  pieces = rowIDWithoutModifier.split(';');
  shiftIDs = pieces[1].slice(6).split('_');

  console.log(shiftIDs);
  return shiftIDs;
}


function showRemoveAlert() {
  return window.confirm('Are you sure you want to remove this signup?');
}

function getSignupFromListById(checkList, signupId) {
  for (i = 0; i < checkList.length; i++) {
    if (checkList[i].signupId === signupId) {
      return checkList[i];
    }
  }
  return null;
}

function removeSignupFromList(checkList, signupId) {
  for (i = 0; i < checkList.length; i++) {
    if (checkList[i].signupId === signupId) {
      checkList.splice(i, 1);
    }
  }
  return checkList;
}

function getEventFromSignupID(signupID) {
  pieces = signupID.split(';');
  return pieces[0].slice(6);
}


function CreatorViewSignup(eventID, shiftID, eventName, eventStart, eventEnd, participantName, participantEmail, approvalStatus) {
  this.signupId = "event:" + eventID + ";shift:" + shiftID;
  this.eventName = eventName;
  this.eventStart = eventStart;
  this.eventEnd = eventEnd;
  this.participantName = participantName;
  this.participantEmail = participantEmail;
  this.approvalStatus = approvalStatus;
}

function showCreatorSignupsTable(listOfSignups) {
  // TODO get events from here
  // replace signups list here TODO
  if (listOfSignups.length !== 0) {
    pendingTable = document.getElementById('eventsTable');
    pendingTable.innerHTML = creatorShiftsTableTemplate();
    tableBody = document.getElementById('creatorShiftsTable');
    tableDataHTML = "";
    listOfSignups.forEach(function(p, i) {
      if (p.approvalStatus === 'pending') {
        tableDataHTML += pendingSignupsTemplate(p);
      } else {
        tableDataHTML += approvedSignupsTemplate(p);
      }
    });

    console.log(tableDataHTML);

    tableBody.innerHTML = tableDataHTML;
  } else {
    pendingPanelBody = document.getElementById('signupsPanel');
    pendingPanelBody.innerHTML = 'No signups for this event' + pendingPanelBody.innerHTML
    pendingPanelBody = document.getElementById('eventsTable');
    pendingPanelBody.innerHTML = "";
  }
}

function approveSignup(e) {
  rowID = e.target.parentElement.parentElement.parentElement.id;
  console.log(rowID);
  signupID = rowID.split(';');

  signupID = signupID[1].slice(6);
  console.log(signupID)
  changeSignupStatus(signupID, 'approve');
}

function denySignup(e) {
  rowID = e.target.parentElement.parentElement.parentElement.id;
  console.log(rowID);
  signupID = rowID.split(';');

  signupID = signupID[1].slice(6);
  console.log(signupID)
  changeSignupStatus(signupID, 'deny');
}

function changeSignupStatus(signupID, newStatus) {
  // signupFromList = getSignupFromListById(creatorShiftsList, signupID);
  // console.log(signupFromList)
  // console.log(creatorShiftsList);
  // if (signupFromList !== null) {
  if (showAlert(newStatus)) {
    shiftIDs = parseRowId(rowID);
    // remove shifts
    shiftIDs.forEach(function(p, i) {
      var shiftID = {
        shiftId: p
      }
      if (newStatus === 'approve') {
        console.log("HERE");
        handleXMLHTTPPost('/approveSignUp', shiftID, function(responseText) {
          getAllShiftData();
          console.log(responseText);
        });
      } else {
        handleXMLHTTPPost('/denySignup', shiftID, function(responseText) {
          getAllShiftData();
        });
      }
    });
    // also remove from signups list TODO

    // maybe replace with another list
    showCreatorSignupsTable(creatorShiftsList);
  }
}

function showAlert(statusChangeAction) {
  return window.confirm('Are you sure you want to ' + statusChangeAction + ' sign up for this sign up?');
}

function deleteEvent() {
  if (window.confirm('Are you sure you want to delete this event?')) {
    var deleteEvt = {
      userDeleteID: sessionStorage.getItem('creatorID'),
      deleteEventId: eventID
    };
    handleXMLHTTPPost('/deleteEvent', deleteEvt, function(responseText) {
      console.log(responseText);
      window.location = "/creatorHome"
    });
  }
}

function showSignupsPanel() {

  eventsTable = document.getElementById('newSignupsTable');
  eventsTable.innerHTML = timeslotTableTemplate();

  slotsTableBody = document.getElementById('timeslotsTable');
  tableDataHTML = "";
  timeslots.forEach(function(p, i) {
    tableDataHTML += timeslotTemplate(p);
  });
  slotsTableBody.innerHTML = tableDataHTML;

  sidePanelTitle = document.getElementById('sidePanelTitle');
  sidePanelTitle.innerHTML = 'Sign Up For Event';

  optionButtons = document.getElementById('optionButtons');
  optionButtons.innerHTML = '';
}


function signUpForSlot(e) {


  timeslotID = e.target.parentElement.parentElement.parentElement.id;
  console.log(timeslotID)
  var slot = {
    timeSlotId: timeslotID,
    eventId: eventID,
    userId: sessionStorage.getItem('participantID')
  }

  handleXMLHTTPPost('/signUpForShift', slot, function(responseText) {
    console.log(responseText);
    updateAndDisplaySignups()

  });

}

function Timeslot(eventID, timeslotID, slotStart, slotEnd) {
  this.eventID = eventID;
  this.timeslotID = timeslotID;
  this.slotStart = slotStart;
  this.slotEnd = slotEnd;
}

function removeSignupsFromList(signuplist, timeslotlist) {

  for (i = 0; i < signuplist.length; i++) {
    removeSlot = false;
    removeIndex = -1;
    for (j = 0; j < timeslotlist.legnth; j++) {
      if (signuplist[i].time_slot_id === timeslotlist[j].time_slot_id) {
        removeSlot = true;
        removeIndex = j;
        break;
      }
    }
    timeslotlist.splice(j, 1);
  }
}

function removeDeniedSignups(signuplist) {
  deniedIndices = [];
  for (i = 0; i < signuplist.length; i++) {
    if (signuplist[i].approval_status === 'denied') {
      deniedIndices.unshift(i);
    }
  }

  for (j = 0; j < deniedIndices.length; j++) {
    signuplist.splice(deniedIndices[j], 1);
  }
}
