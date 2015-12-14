var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;

// var fullMovieList = ["Jaws", "Jaws 2", "Jaws 3", "Space Jams", "Big Fish", "The Illusionist"];


// var fileStream = fs.createWriteStream(path.join(__dirname, "public/movies.txt"));
// fileStream.write(JSON.stringify(fullMovieList));

// event fields
// eventID


// user fields



app.use(express.static(path.join(__dirname, '/public')));


app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

app.get('/events', function(req, res) {
  // get events
});

app.post('/editEvent', function(req, res) {
  // update single event
  eventID = req.body.eventID;

  // get all other fields
  // update in DB

  // send update to users that are part of event

});

app.post('/deleteUser', function(req, res) {
  userID = req.body.userID;

  // delete USER from db
});

app.post('/deleteEvent', function(req, res) {
  eventID = req.body.userID;

  // delete event from DB
});

app.post('/signupForEvent', function(req, res) {

  userID = req.body.userID;
  eventID = req.body.userID;

  // check that event is in future
  // check that time slot is not full



  // create new shift --- i think...?
});


function getUsersForEvent(eventID) {
  listOfUsers = [];
  // get from DB
  return listOfUsers;
}

function getShiftsForEvent(eventID) {
  listOfShifts = [];

  return listOfShifts;
}

function createAccount(userEmail, userType) {
  // create in DB
  return userID;
}

function getUsersForEvent(eventID) {

}

function getEventsForUser(userID) {

}
