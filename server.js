var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public')));


app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});
