var express = require('express');
var path = require('path');
var fs = require('fs');
var pg = require('pg');
var bodyParser = require("body-parser");

var conString = "postgres://eqrtivpbzjhwwr:mQgfaM_AbwX1zRMnTvS2syW5As@ec2-54-204-5-56.compute-1.amazonaws.com:5432/dbdn3460h4l44i";

var client = new pg.Client({
  user: "eqrtivpbzjhwwr",
  password: "mQgfaM_AbwX1zRMnTvS2syW5As",
  database: "dbdn3460h4l44i",
  port: 5432,
  host: "ec2-54-204-5-56.compute-1.amazonaws.com",
  ssl: true
});

client.connect(function(err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  console.log("Successfully Connected to database");
});

var Enum = require('enum');

var HashMap = require('hashmap');

var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true

}));


var PENDING = 0;
var APPROVED = 1;
var DENIED = 2;

var RECUR_NONE = 0;
var RECUR_WEEKLY = 1;
var RECUR_MONTHLY = 2;

app.use(express.static(path.join(__dirname, '/public')));

app.post('/createUser', function(req, res) {

  var userName = req.body.userName;
  var userEmail = req.body.userEmail;
  var userType = req.body.userType;

  console.log(userEmail);
  var query = client.query(('insert into users (user_type_id, user_name, user_email) ' +
      'values (' + userType + ', \'' + userName + '\', \'' + userEmail + '\')'),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        console.log(result.rows);
        res.sendStatus(200);
      }
    }
  );

});

app.post('/login', function(req, res) {
  var userEmail = req.body.userEmail;

  console.log(userEmail);
  var query = client.query(('select * from users where user_email=\'' + userEmail + '\''),
    function(err, result) {
      if (err) {
        res.send(err);
      } else if (result.rows.length > 0) {
        console.log(result.rows);
        res.status(200).send({
          userId: result.rows[0].user_id,
          userType: result.rows[0].user_type_id
        });
      } else {
        res.send("ERROR: Email Not on File")
      }
    }
  );

});

app.post('/cancelSignUp', function(req, res) {

  var shiftID = req.body.shiftID;
  var userID = req.body.userID;
  console.log(req.body);

  queryString = 'delete from shift where shift_id = ' + shiftID + ' and user_id=' + userID;

  console.log(queryString);

  var query = client.query((queryString),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.post('/createEvent', function(req, res) {
  var eventName = req.body.eventName;
  var eventOwnerId = req.body.eventOwnerId;
  var eventDescription = req.body.eventDescription;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var recurrenceStartDate = req.body.recurrenceStartDate;
  var recurrenceEndDate = req.body.recurrenceEndDate;
  var recurrenceTypeId = req.body.recurrenceTypeId;

  var queryString = ""


  if (recurrenceTypeId != RECUR_NONE) {
    var queryRecurString = "insert into recurrence_event (recurrence_type_id, recurrence_start_date, recurrence_end_date)" +
      " values (" + recurrenceTypeId + ", \'" + recurrenceStartDate + "\', \'" + recurrenceEndDate + "\'); " +
      "SELECT currval(pg_get_serial_sequence('recurrence_event','recurrence_event_id'));";

    var query = client.query(queryRecurString,
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          recurrenceId = result.rows[0].currval;
          console.log(recurrenceId);

          queryString2 = "insert into events (event_name, event_owner_id, event_description, recurrence_event_id, start_time, end_time)" +
            'values (\'' + eventName + '\', ' + eventOwnerId + ', \'' + eventDescription + '\', ' + recurrenceId + ', ' +
            '\'' + recurrenceStartDate + ' ' + startTime + ' America/New_York\',' +
            '\'' + recurrenceStartDate + ' ' + endTime + ' America/New_York\' )';

          var query2 = client.query(queryString2,
            function(err, result) {
              if (err) {
                res.send(err);
              } else {
                res.sendStatus(200);
              }
            }
          );
        }
      }
    );
  } else {
    queryString = "insert into events (event_name, event_owner_id, event_description, start_time, end_time)" +
      'values (\'' + eventName + '\', ' + eventOwnerId + ', \'' + eventDescription + '\', ' +
      '\'' + recurrenceStartDate + ' ' + startTime + ' America/New_York\',' +
      '\'' + recurrenceStartDate + ' ' + endTime + ' America/New_York\' )';

    var query2 = client.query(queryString,
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  }

  console.log(queryString);




  //
  // var query = client.query(queryString,
  //     function(err, result) {
  //         if (err) {
  //             res.send(err);
  //         } else {
  //             res.sendStatus(200);
  //         }
  //     }
  // );
});

app.post('/approveSignUp', function(req, res) {
  var shiftID = req.body.shiftId;
  var query = client.query(("UPDATE shift set approval_status_id=" + APPROVED + " where shift_id=" + shiftID),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});



app.post('/denySignUp', function(req, res) {
  var shiftID = req.body.shiftId;
  var query = client.query(("UPDATE shift set approval_status_id=" + DENIED + " where shift_id=" + shiftID),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});


app.post('/signUpForShift', function(req, res) {
  var timeSlotId = req.body.timeSlotId;
  var userId = req.body.userId;
  var eventId = req.body.eventId;

  var queryString = "INSERT into shift (user_id, time_slot_id, approval_status_id, event_id) " +
    "values (" + userId + ", " + timeSlotId + ", " + PENDING + ", " + eventId + ")";

  console.log(queryString);

  var query = client.query((queryString),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.post('/deleteEvent', function(req, res) {
  var eventId = req.body.eventId;
  var userId = req.body.userId;

  var queryString = "DELETE from events where event_id=" + eventId + " and event_owner_id=" + userId + ";" +
    "DELETE from time_slot where event_id=" + eventId + ";" +
    "DELETE from shift where event_id=" + eventId + ";";

  console.log(queryString);
  var query = client.query((queryString),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.post('/editEvent', function(req, res) {
  var newDescription = req.body.newDescription;
  var newName = req.body.newName;
  var eventId = req.body.eventId;

  queryString = "UPDATE events set event_description=\'" + newDescription + "\'," +
    "event_Name=\'" + newName + "\' " +
    "WHERE event_id=" + eventId;

  console.log(queryString);

  var query = client.query((queryString),
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.get('/getAllOwnedEvents', function(req, res) {
  var ownerID = req.body.ownerID;
  var query = client.query('SELECT * from events where event_owner_id=' + ownerID, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.sendStatus(200);
      console.log(result.rows);
    }
  });
});

app.get('/createNewEvent', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/views/createEvent.html'));
});

app.get('/getEventsByDate', function(req, res) {
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;

  queryString = "SELECT * from events where start_time < " + endDate + " and start_time > " + startDate;

  console.log(queryString);

  var query = client.query(queryString,
    function(err, result) {
      if (err) {
        res.send(err);
      } else if (result.rows.length > 0) {
        console.log(result.rows);
        res.status(200).send(result.rows);
      } else {
        res.send("ERROR: No events in date range");
      }
    }
  );

  console.log(startDate);
  console.log(endDate);
});

app.get('/getMySignUps', function(req, res) {
  var userID = req.query.userID;
  console.log(userID);


  queryString = 'select ' +
    'shift.shift_id, ' +
    'shift.user_id as shift_user_id, ' +
    'approval_status.approval_status,' +
    'eventAndSlot.time_slot_id, ' +
    'eventAndSlot.capacity, ' +
    'eventAndSlot.event_id, ' +
    'eventAndSlot.start_time, ' +
    'eventAndSlot.end_time, ' +
    'eventAndSlot.event_name, ' +
    'eventAndSlot.event_description, ' +
    'eventAndSlot.event_owner_id, ' +
    'eventAndSlot.start_date, ' +
    'users.user_email, '+
    'users.user_name ' +
    'from shift ' +
    'LEFT OUTER join ' +
    '(select ' +
    'time_slot.time_slot_id, ' +
    'time_slot.capacity, ' +
    'time_slot.event_id, ' +
    'time_slot.start_time, ' +
    'time_slot.end_time, ' +
    'events.event_name, ' +
    'events.event_description, ' +
    'events.event_owner_id, ' +
    'events.start_time as start_date ' +
    'from time_slot ' +
    'LEFT OUTER JOIN events ' +
    'on (time_slot.event_id = events.event_id) ' +
    ') as eventAndSlot ' +

    'on (shift.time_slot_id = eventAndSlot.time_slot_id) ' +

    'LEFT OUTER JOIN approval_status '+
    'on(shift.approval_status_id = approval_status.approval_status_id)'+

    'LEFT OUTER JOIN users '+
    'on(eventAndSlot.event_owner_id = users.user_id) ' +

    'where shift.user_id = ' + userID;

  console.log(query);

  console.log(userID);
  var query = client.query(queryString,
    function(err, result) {
      if (err) {
        res.send(err);
      } else if (result.rows.length > 0) {
        console.log(result.rows);
        res.status(200).send(result.rows);
      } else {
        res.send("ERROR: Email Not on File");
      }
    }
  );
});


app.get('/getEventDetails', function(req, res) {
  var eventId = req.query.eventID;
  var queryString = 'SELECT * from events where event_id=' + eventId;
  console.log(queryString);
  var query = client.query(queryString,
    function(err, result) {
      if (err) {
        res.send(err);
      } else if (result.rows.length > 0) {
        console.log(result.rows);
        res.status(200).send(result.rows);
      } else {
        res.send("ERROR: Event ID Does not Exist");
      }
    }
  );
});


// insert into users (user_type_id, user_name, user_email) values ($1, $2, $2)

app.get('/eventsById', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/views/homePage/home.html'));
});

app.get('/participantEventDetails', function(req, res) {
  console.log('getting eventDetails for ' + req.query.eventID);
  res.sendFile(path.join(__dirname, '/public/views/participantEventDetails.html'));
});

app.get('/creatorEventDetails', function(req, res) {
  console.log('getting eventDetails for ' + req.query.eventID);
  res.sendFile(path.join(__dirname, '/public/views/creatorEventDetails.html'));
});

app.get('/participantHome', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/views/participantHome.html'));
});

app.get('/creatorHome', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/views/creatorHome.html'));
});

app.get('/creatorEvents', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/views/creatorEvents.html'));
});

app.get('/participantEvents', function(req, res) {
  console.log('participantEvents');
  res.sendFile(path.join(__dirname, '/public/views/participantEvents.html'));
});

app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/views/homePage/home.html'));
});


app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

var recurrenceEnum = new Enum(['none', 'weekly', 'monthly']);
var userTypeEnum = new Enum(['organizer', 'participant']);
var approvalEnum = new Enum(['pending', 'approved', 'denied']);
var dayOfWeekEnum = new Enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);


// if not recurring, recurrence start date will be original date, recurrenceEndDate should be -1
// reccurence passed is enum
function createEvent(eventName, eventDescription, eventOwnerID, recurrence, startDate, recurrenceEndDate, capacity, startTime, endTime) {
  // save event
  newEvent = Event(eventName, eventDescription, eventOwnerID, recurrence, startDate, recurrenceEndDate, -1);
  // put event in DB, getEventID

  datesList = [];

  if (reccurrenceEnum.none.is(reccurrence)) {
    datesList.push(startDate);
  } else if (reccurrenceEnum.weekly.is(reccurrence)) {
    // get original date
    dateAdded = startDate;

    while (dateBefore(dateAdded, recurrenceEndDate) < 1) {
      datesList.push(dateAdded);
      dateAdded = getDateForNextWeek(dateAdded);
    }
  } else if (reccurrenceEnum.monthly.is(reccurrence)) {
    dateAdded = startDate;

    while (dateBefore(dateAdded, recurrenceEndDate) < 1) {
      datesList.push(dateAdded);
      dateAdded = getDateForNextMonth(dateAdded);
    }
  }

  for (j = 0; j < datesList.length; j++) {
    // create time slots
    for (i = startTime; i < endTime; i += (30 * 60 * 1000)) {
      newTimeSlot = TimeSlot(capacity, eventID, i, i + (30 * 60 * 1000), datesList[j])
        // save new timeslot to DB
    }
  }
}

function Event(eventName, eventDescription, eventOwnerID, recurrence, recurrenceStartDate, recurrenceEndDate, eventID) {
  this.eventName = eventName;
  this.eventDescription = eventDescription;
  this.eventOwnerID = eventOwnerID;
  this.recurrence = recurrence;
  this.recurrenceStartDate = recurrenceStartDate;
  this.recurrenceEndDate = recurrenceEndDate;
  this.eventID = eventID;
}

function TimeSlot(capacity, eventID, startTime, endTime, date) {
  this.capacity = capacity;
  this.eventID = eventID;
  this.startTime = startTime;
  this.endTime = endTime;
  this.date = date;
}

// returns -1 for date1 before date2
// returns 0 for date1 = date2
// returns 1 for date1 after date2
function dateBefore(date1, date2) {
  // TODO
}

function getDateForNextMonth(date) {
  // TODO
}

function getDateForNextWeek(date) {
  // TODO
}

function getShiftsForTimeslot(timeslotID) {
  // TODO
}

function getShiftsWithEventIDAndUserID(userID, eventID, startTimeRange, endTimeRange) {
  // get all shifts for a user
  shifts = [];
  validShifts = [];
  for (i = 0; i < shifts; i++) {
    // get timeslot of shift
    timeslot = ""; // TODO
    if (timeslot.eventID === eventID) {
      keepShift = true;
      if (startTimeRange != -1) {
        keepShift = keepShift && (dateBefore(startTimeRange, timeslot.date) < 1)
      }
      if (endTimeRange != -1) {
        keepShift = keepShift && (dateBefore(timeslot.date, endTimeRange) < 1)
      }
      if (keepShift) {
        validShifts.push(shifts[i]);
      }
    }
  }
  return keepShifts;
}

// creatorID - userID of organzier
// allowedSignupStatuses - array of allowed signups
function getSignupsForCreator(creatorID, allowedSignupStatuses) {
  // TODO get events with event.ownerID = creatorID
  creatorsEvents = []; // fix TODO
  returnShfits = []
  for (i = 0; i < creatorsEvents.length; i++) {
    // TODO get shifts for eventID
    shiftsForEvent = []; // TODO
    for (j = 0; j < shiftsForEvent.length; j++) {
      // may not work depending on object equality
      if (allowedSignupStatuses.indexOf(shiftsForEvent[i].approved) != -1) {
        returnShifts.push(shiftsForEvent[i]);
      }
    }
  }
  return returnShfits;
}

// must pass contiguous shifts
function getStartAndEndForShifts(shiftsList) {
  minStart = Infinity;
  maxEnd = -1;
  for (i = 0; i < shiftsList.length; i++) {
    timeslotStartTime = -1; // fix TODO get start time of timeslot corresponding to shiftList[i]
    timeslotEndTime = -1; // get end time of timeslot corresponding to shfit list [i]
    if (minStart < timeslotStartTime) {
      minStart = timeslotStartTime;
    }
    if (timeslotEndTime > maxStart) {
      maxEnd = timeslotEndTime;
    }
  }

  return [minStart, maxEnd]
}

// approve = true for approved, falsse for deny
function changeSignupStatus(approve, startTime, endTime, eventID, userID) {
  // get all timeslots for event
  // get all shifts for given timeslots
  // edit approved field for all
}

function deleteUser(userID) {
  // get user type
  if (userType === 'organizer') {
    // get all events with organizer in as creatorID
    eventsByCreator = []
      // get all timeslots for those events
    for (i = 0; i < eventsByCreator.length(); i++) {
      // get timeslots for eventsByCreator[i]
      usersInShifts = []; // get all affected users

      timeslots = [];
      for (j = 0; j < timeslots.length; j++) {
        // get shifts for timeslots[i]
        shifts = [];
        // delete shifts from DB
      }
      // notify affected users
      // delete timeslots from DB
    }
    // delete events
  } else {
    // get all shifts with userID
    // notify organizer...?
    // remove all shifts with userID
  }
}

function getSignupsForUser(userID) {
  // get shifts for user
  shiftsList = []; // TODO

  return signups;
}

function Signup(serviceEvent, date, startTime, endTime) {
  this.serviceEvent = serviceEvent;
  this.date = date;
  this.startTime = startTime;
  this.endTime = endTime;
}

function Shift(status, timeslotID, userID) {
  this.approveStatus = approveStatus;
  this.timeslotID = timeslotID;
  this.userID = userID;
}

function getDayOfWeekFromDate(date) {
  // TODO
}

// ranges are inclusive
function getEventsInDateRange(startDate, endDate) {
  // TODO
}


function clientSideDateToDbDate(dateToConvert) {
  // convert date
  return dateToConvert;
}

function dbDateToClientSideDate(dateToConvert) {
  // convert date
  return dateToConvert;
}

function groupShiftsIntoSignups(listOfShifts) {
  eventShiftMap = new HashMap();

  for (i = 0; i < listOfShifts.length; i++) {
    timeslotID = listOfShifts[i].timeslotID;
    // get timeslot
    timeslot = ""; // TODO
    eventID = timeslot.eventID;
    key = [eventID, timeslot.ef];
    if (eventShiftMap.has(key)) {
      shiftsForEvent = eventShiftMap.get(key);
      shiftsForEvent.push(listOfShifts[i]);
      eventShiftMap.set(key, shiftsForEvent[i]);
    } else {
      eventShiftMap.set(key, [listOfShifts[i]]);
    }
  }

  signups = [];
  eventShiftMap.forEach(function(value, key) {
    times = getStartAndEndForShifts(value);

    // get event from key[0] <- eventID
    serviceEvent = ""; // TODO

    // get date from key[1] <- timestampID
    date = ""; // TODO

    newSignup = Signup(serviceEvent, date, times[0], times[1]);

    signups.push(newSignup);
  });

  return signups;
}

function createUser(useremail, userType) {
  // add to db
}
