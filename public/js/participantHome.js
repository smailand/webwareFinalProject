signupsList = [];



function fetchDataForPage() {
  console.log('fetching data');

  // get user signups
  userID = sessionStorage.getItem('participantID');

  handleXMLHTTPGet('/getMySignUps', 'userID=' + userID, function(response) {
    console.log(response);


    for(i=0; i < response.length; i++){
        shift = response[i];
        signup1 = new Signup(shift.event_id, shift.shift_id, shift.event_name, shift.start_time, shift.end_time, shift.approval_status, shift.user_name, shift.user_email, new Date(shift.start_date));
        signupsList.push(signup1)
    }


    // TODO get events from here
    // replace signups list here TODO
    showSignupsListTable(signupsList);
  });
}

function showSignupsListTable(listOfSignups) {
  // TODO get events from here
  // replace signups list here TODO
  if (listOfSignups.length !== 0) {
    eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = myEventsTableTemplate();
    tableBody = document.getElementById('myEventsTableBody');
    tableDataHTML = "";
    listOfSignups.forEach(function(p, i) {
      tableDataHTML += mySignupsTemplate(p);
    });

    tableBody.innerHTML = tableDataHTML;
  } else {
    eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = "";
    eventsPanelBody = document.getElementById('eventsPanelBody');
    eventsPanelBody.innerHTML = "You are not signed up for any upcoming events";
  }
}


// all should be strings
function Signup(eventID, shiftID, eventName, shiftStart, shiftEnd, approvalStatus, organizerName, organizerEmail, eventDate) {
  this.signupId = "event:" + eventID + ";shift:" + shiftID;
  this.eventName = eventName;
  this.shiftStart = shiftStart;
  this.shiftEnd = shiftEnd;
  this.approvalStatus = approvalStatus;
  this.organizerName = organizerName;
  this.organizerEmail = organizerEmail;
  this.eventDate = eventDate;
}

function removeSignup(e) {
  removeBtn = e.target;
  parent = removeBtn.parentElement;
  rowID = e.target.parentElement.parentElement.id;
  signupID = rowID.slice(6);
  signupFromList = getSignupFromListById(signupsList, signupID);
  if (signupFromList !== null) {
    if (showRemoveAlert(signupFromList)) {
      shiftsToRemove = parseRowId(rowID);
      // remove shifts
      shiftIDs.forEach(function(p, i) {
        var deleteID = {
          userID: parseInt(sessionStorage.getItem('participantID')),
          shiftID: parseInt(p)
        }
        handleXMLHTTPPost('/cancelSignUp', deleteID, function(responseText) {
          console.log(responseText);
        });
        // also remove from signups list TODO
        removeSignupFromList(signupsList, signupID);
        // maybe replace with another list
        showSignupsListTable(signupsList);
      })
    }
  } else {
    // display error message telling user to refresh page
    // TODO
  }
  e.stopPropagation();
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

function showEventDetailPage(e) {
  if ((e.target.tagName === 'td') || (e.target.tagName === 'TD')) {
    rowID = e.target.parentElement.id;
  } else if ((e.target.tagName === 'tr') || (e.target.tagName === 'TR')) {
    rowID = e.target.id;
  } else {
    // uhhhhh ..... TODO
  }

  signupID = rowID.slice(6);
  eventID = getEventFromSignupID(signupID);
  window.location = '/participantEventDetails?eventID='+eventID;
}
