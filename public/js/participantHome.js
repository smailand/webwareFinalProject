signupsList = [];

signup1 = new Signup('a', 'b_D_7', 'c', 'd', 'e', 'approved', 'f', 'g');
signupsList.push(signup1);
signupsList.push(new Signup('q', 'r', 's', 't', 'u', 'pending', 'l', 'g'));


function fetchDataForPage() {
  console.log('fetching data');

  // get user signups
  userID = sessionStorage.getItem('participantID');

  handleXMLHTTPGet('/getMySignUps', 'userID=' + userID, function(responseText) {
    console.log(responseText);

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
      console.log(tableDataHTML);
      tableDataHTML += mySignupsTemplate(p);
    });

    console.log(tableDataHTML);

    tableBody.innerHTML = tableDataHTML;
  } else {
    eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = "";
    eventsPanelBody = document.getElementById('eventsPanelBody');
    eventsPanelBody.innerHTML = "You are not signed up for any upcoming events";
  }
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

function handleXMLHTTPPost(postTo, postData, callbackFunc) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:3000" + postTo,
    "method": "POST",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b8241e93-87d3-1713-4188-5ec9c2653f79",
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": postData
  };

  $.ajax(settings).done(callbackFunc);
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
  signupFromList = getSignupFromListById(signupsList, signupID);
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
        removeSignupFromList(signupsList, signupID);
        // maybe replace with another list
        showSignupsListTable(signupsList);
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
  sessionStorage.setItem('detailEventID', eventID);
  window.location = '/participantEventDetails?eventID='+eventID;
}
