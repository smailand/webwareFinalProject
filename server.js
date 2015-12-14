var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;

// var fullMovieList = ["Jaws", "Jaws 2", "Jaws 3", "Space Jams", "Big Fish", "The Illusionist"];


// var fileStream = fs.createWriteStream(path.join(__dirname, "public/movies.txt"));
// fileStream.write(JSON.stringify(fullMovieList));

app.use(express.static(path.join(__dirname, '/public')));


app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});
