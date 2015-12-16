upcomingEvents = [];
pendingSignups = [];

function fetchDataForPage() {
  console.log('fetching data');

  // get user signups
  userID = sessionStorage.getItem('creatorID');

  handleXMLHTTPGet('/getMySignUps', 'userID=' + userID, function(responseText) {
    console.log(responseText);

    // TODO actually put data here
    upcomingEvents = [];
    pendingSignups = [];

    upcomingEvents.push(new EventDetails('abc', 'NewVEthjw', 'wehfwegfhoiugih3ewjripuaogfyhjuoi', 'asdf', 'jkl;', '8', 0, 'MANDI', 'mandi@com.email'));
    pendingSignups.push(new PendingSignup('abc', '12', 'NewVEthjw', 'ahdsoji', 'qhire', 'MANDI', 'still mandi'));


    showUpcomingEventsTable(upcomingEvents);
    showPendingSignupsTable(pendingSignups);

  });
}


function showUpcomingEventsTable(listOfEvents) {
  // TODO get events from here
  // replace signups list here TODO
  if (listOfEvents.length !== 0) {
    eventsTable = document.getElementById('upcomingEventsTable');
    eventsTable.innerHTML = creatorEventsTableTemplate();
    tableBody = document.getElementById('myEventsTableBody');
    tableDataHTML = "";
    listOfEvents.forEach(function(p, i) {
      console.log(tableDataHTML);
      tableDataHTML += creatorEventsTemplate(p);
    });

    console.log(tableDataHTML);

    tableBody.innerHTML = tableDataHTML;
  } else {
    eventsTable = document.getElementById('upcomingEventsTable');
    eventsTable.innerHTML = "";
    eventsPanelBody = document.getElementById('upcomingEventsPanel');
    eventsPanelBody.innerHTML = "You do not have any upcoming events";
  }
}

function showPendingSignupsTable(listOfPendingSignpus) {
  // TODO get events from here
  // replace signups list here TODO
  if (listOfPendingSignpus.length !== 0) {
    pendingTable = document.getElementById('pendingSignupsTable');
    pendingTable.innerHTML = pendingSignupsTableTemplate();
    tableBody = document.getElementById('myPendingEventsTableBody');
    tableDataHTML = "";
    listOfPendingSignpus.forEach(function(p, i) {
      console.log(tableDataHTML);
      tableDataHTML += pendingSignupsTemplate(p);
    });
    tableBody.innerHTML = tableDataHTML;
  } else {
    pendingTable = document.getElementById('pendingSignupsTable');
    pendingTable.innerHTML = "";
    pendingPanelBody = document.getElementById('pendingSignupsPanel');
    pendingPanelBody.innerHTML = "There are no pending signups";
  }
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

function PendingSignup(eventID, shiftID, eventName, eventStart, eventEnd, participantName, participantEmail) {
  this.signupId = "event:" + eventID + ";shift:" + shiftID;
  this.eventName = eventName;
  this.eventStart = eventStart;
  this.eventEnd = eventEnd;
  this.participantName = participantName;
  this.participantEmail = participantEmail;
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
  window.location = '/creatorEventDetails?eventID=' + eventID;
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
  signupFromList = getSignupFromListById(pendingSignups, signupID);
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
      removeSignupFromList(pendingSignups, signupID);
      // maybe replace with another list
      showPendingSignupsTable(pendingSignups);
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

function showAlert(signup, statusChangeAction) {
  return window.confirm('Are you sure you want to ' + statusChangeAction +' sign up for ' + signup.participantName + ' at ' + signup.eventName + ' occuring from ' + signup.eventStart + ' to ' + signup.eventEnd + '?');
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
