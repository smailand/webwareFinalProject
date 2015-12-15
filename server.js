var express = require('express');
var path = require('path');
var fs = require('fs');
var pg = require('pg');

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
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  console.log("Successfully Connected to database");

  //
  // var query = client.query('select * from recurrence_types where reccurence_type_id=1');
  // query.on('row', function(row) {
  //     console.log(row);
  // });

});

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/app')));


app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/app/index.html'));
});

app.get('/eventsById', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});


app.listen(port, function() {
  console.log('App is listening on port ' + port);
});


// if not recurring, recurrence start date will be original date, recurrenceEndDate should be -1
function createEvent(eventName, eventDescription, eventOwnerID, recurrence, startDate, recurrenceEndDate, capacity, startTime, endTime) {
  // save event
  newEvent = Event(eventName, eventDescription, eventOwnerID, recurrence, startDate, recurrenceEndDate, -1)
    // put event in DB, getEventID

  datesList = [];

  if (reccurrence === 'none') {
    datesList.push(startDate);
  } else if (reccurrence === 'weekly') {
    // get original date
    dateAdded = startDate;

    while (before(dateAdded, recurrenceEndDate)) {
      datesList.push(dateAdded);
      dateAdded = getDateForNextWeek(dateAdded);
    }
  } else if (reccurrence === 'monthly') {
    dateAdded = startDate;

    while (before(dateAdded, recurrenceEndDate)) {
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

function dateBefore(date1, date2) {
  // TODO
}

function getDateForNextMonth(date) {
  // TODO
}

function getDateForNextWeek(date) {
  // TODO
}

function signUpForTime(userID, eventID, startTime, endTime, date) {
  for (i = 0; i < endTime; i += (30 * 60 * 1000)) {
    // get time slot with eventID, startTime = i, endTime = i+30*60*1000, date = date
    if (timeslot.capacity > getShiftsForTimeslot(timeslot).length) {
      // allow signup
      // TODO: Do we want to create the new shifts here, or make sure they can sign up for all of the requested shifts
    } else {
      // error
      // TODO
    }
  }

  for (i = 0; i < endTime; i += (30 * 60 * 1000)) {
    // get time slot with eventID, startTime = i, endTime = i+30*60*1000, date = date
    // create shift with userID, timeslot ID, approved=false
  }
}

function getShiftsForTimeslot(timeslotID) {
  // TODO
}

// creatorID - userID of organzier
// getApproved - true if should get signups that have already been approved, false if not
function getSignupsForCreator(creatorID, getApproved) {
  // TODO get events with event.ownerID = creatorID
  creatorsEvents = []; // fix TODO
  returnShfits = []
  for (i = 0; i < creatorsEvents.length; i++) {
    // TODO get shifts for eventID
    shiftsForEvent = [];  // TODO
    for (j = 0; j < shiftsForEvent.length; j++) {
      if (shiftsForEvent[i].approved === getApproved) {
        returnShfits.push(shiftsForEvent[i]);
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
function changeSignupStatus(approve, startTime, endTime, eventID) {
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
  }
}

function getSignupsForUser(userID) {
  // get all signups matching user id
  shifts = [];
  timeslots = [];
  //events = [];
  for (i = 0; i < shifts.length; i++) {
    // get timeslot from shift
    // TODO finsih this later
    // must group timeslots based on eventID
  }

  // generate signups based on event grouping
  signups = [];

  return signups;

}

function Signup(serviceEvent, date, startTime, endTime) {
  this.serviceEvent = serviceEvent;
  this.date = date;
  this.startTime = startTime;
  this.endTime = endTime;
}
