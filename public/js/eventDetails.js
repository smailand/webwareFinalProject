var userType = "";
shiftsList = [];
creatorShiftsList = [];
eventID = "";

serviceEvent = "";

timeslots = [];

signup1 = new CreatorViewSignup('a', 'b_D_7', 'c', 'd', 'e', 'f', 'g', 'Approved');
creatorShiftsList.push(signup1);
creatorShiftsList.push(new CreatorViewSignup('q', 'r', 's', 't', 'u', 'l', 'g', 'Pending'));
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
    creatorShiftsList;

    showCreatorSignupsTable(creatorShiftsList);
  } else {
    updateAndDisplaySignups();
  }
}

function updateAndDisplaySignups() {
  handleXMLHTTPGet('/getTimeSlotByEventId', 'eventID=' + eventID, function(responseText) {
    timeslots = responseText;
    handleXMLHTTPGet('/getTimeSlotByEventId', 'eventID=' + eventID, function(responseText2) {

        console.log(timeslots[0])
        console.log(responseText);
        shiftsList = [];
        removeSignupsFromList
        showShiftsTable(shiftsList);
        showSignupsPanel();
      )
    };
  });
}

function showButtonsForUser(typeOfUser) {
  optionButtons = document.getElementById('optionButtons');
  if (typeOfUser === 'creator') {
    optionButtons.innerHTML = '<button type="button" class="btn btn-primary">Edit Event</button>';
    optionButtons.innerHTML += '<button type="button" class="btn btn-danger" onclick="deleteEvent()">Delete Event</button>'
    detailsPanel = document.getElementById("details");
    detailsPanel.hidden = false;
  }
  // else {
  //   optionButtons.innerHTML = '<button type="button" class="btn btn-primary" onclick="showSignupsPanel()">Sign Up</button>';
  // }
}

function showShiftsTable(shiftsList) {
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
  removeBtn = e.target;
  parent = removeBtn.parentElement;
  rowID = e.target.parentElement.parentElement.id;
  signupID = rowID.slice(6);
  signupFromList = getSignupFromListById(shiftsList, signupID);
  if (signupFromList !== null) {
    if (showRemoveAlert(signupFromList)) {
      shiftsToRemove = parseRowId(rowID);
      // remove shifts
      shiftIDs.forEach(function(p, i) {
        var deleteID = {
          userDeleteID: sessionStorage.getItem('participantID'),
          deleteShiftId: p
        }
        handleXMLHTTPPost('/cancelSignUp', deleteID, function(responseText) {
          console.log(responseText);
        });
        // also remove from signups list TODO
        removeSignupFromList(shiftsList, signupID);
        // maybe replace with another list
        showShiftsTable(shiftsList);
      })
    }
  } else {
    // display error message telling user to refresh page
    // TODO
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

function showRemoveAlert(signup) {
  return window.confirm('Are you sure you want to unsign up for ' + signup.eventName + ' occuring from ' + signup.eventStart + ' to ' + signup.eventEnd + '?');
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
      if (p.approvalStatus === 'Pending') {
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
  signupID = rowID.slice(6);
  changeSignupStatus(signupID, 'approve');
}

function denySignup(e) {
  rowID = e.target.parentElement.parentElement.parentElement.id;
  console.log(rowID);
  signupID = rowID.slice(6);
  changeSignupStatus(signupID, 'deny');
}

function changeSignupStatus(signupID, newStatus) {
  signupFromList = getSignupFromListById(creatorShiftsList, signupID);
  if (signupFromList !== null) {
    if (showAlert(signupFromList, newStatus)) {
      shiftIDs = parseRowId(rowID);
      // remove shifts
      shiftIDs.forEach(function(p, i) {
        console.log(p);
        var shiftID = {
          shiftId: p
        }
        if (newStatus === 'approve') {
          handleXMLHTTPPost('/approveSignUp', shiftID, function(responseText) {
            console.log(responseText);
          });
        } else {
          handleXMLHTTPPost('/denySignup', shiftID, function(responseText) {
            console.log(responseText);
          });
        }
      });
      // also remove from signups list TODO
      if (newStatus === 'approve') {
        signupFromList.approvalStatus = "Approved";
      } else {
        removeSignupFromList(creatorShiftsList, signupID);
      }
      // maybe replace with another list
      showCreatorSignupsTable(creatorShiftsList);
    }
  } else {
    // display error message telling user to refresh page
    // TODO
  }
}

function showAlert(signup, statusChangeAction) {
  return window.confirm('Are you sure you want to ' + statusChangeAction + ' sign up for ' + signup.participantName + ' at ' + signup.eventName + ' occuring from ' + signup.eventStart + ' to ' + signup.eventEnd + '?');
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
  timeslotID = e.target.parentElement.parentElement.id;
  var slot = {
    timeSlotId: timeslotID,
    eventId: eventID,
    userId: sessionStorage.getItem('participantID')
  }

  handleXMLHTTPPost('/signUpForShift', slot, function(responseText) {
    console.log(responseText);
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
