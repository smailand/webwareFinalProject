var userType = "";
shiftsList = [];

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

  showButtonsForUser(userType);

  if (userType === 'creator') {
    // get list of signups for event
    showCreatorSignupsTable([]);
  } else {
    // check to see if user is signed up for this event
    // SAM TODO -- need new get... UserID and eventID, returns shift info
    shiftsList = [];

    signup1 = new Signup('a', 'b_D_7', 'c', 'd', 'e', 'approved', 'f', 'g');
    shiftsList.push(signup1);
    shiftsList.push(new Signup('q', 'r', 's', 't', 'u', 'pending', 'l', 'g'));
    showShiftsTable(shiftsList);
  }
}

function showButtonsForUser(typeOfUser) {
  optionButtons = document.getElementById('optionButtons');
  if (typeOfUser === 'creator') {
    optionButtons.innerHTML = '<button type="button" class="btn btn-primary">Edit Event</button>';
    optionButtons.innerHTML += '<button type="button" class="btn btn-danger">Delete Event</button>'
    detailsPanel = document.getElementById("details");
    detailsPanel.hidden = false;
  } else {
    optionButtons.innerHTML = '<button type="button" class="btn btn-primary">Sign Up</button>';
  }
}

function showShiftsTable(shiftsList) {
  if (shiftsList.length !== 0) {
    eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = userShiftsTableTemplate();
    tableDataHTML = "";

    tableBody = document.getElementById('myShiftsTableBody');
    shiftsList.forEach(function(p, i) {
      console.log(tableDataHTML);
      tableDataHTML += userShiftsTemplate(p);
    });

    tableBody.innerHTML = tableDataHTML;
    detailsPanel = document.getElementById("details");
    detailsPanel.hidden = false;
  } else {
    detailsPanel = document.getElementById("details");
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


function Signup(eventID, shiftID, eventName, eventStart, eventEnd, participantName, participantEmail, approvalStatus) {
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
    pendingTable.innerHTML = pendingSignupsTableTemplate();
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
    pendingPanelBody.innerHTML = 'No signups for this event' + pendingPanelBody .innerHTML
    pendingPanelBody = document.getElementById('eventsTable');
    pendingPanelBody.innerHTML = "";
  }
}
