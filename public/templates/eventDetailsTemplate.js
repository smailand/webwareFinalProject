var approvedSignupTemplate = _.template(
  '<tr class="success" id=signupTable<%= userID %>>' +
  '<td><%= userName %></td>' +
  '<td><%= signupStart %></td>' +
  '<td><%= signupEnd %></td>' +
  '<td></td>' +
  '</tr>'
);

var pendingSignupTemplate = _.template(
  '<tr id=signupTable<%= userID %>>' +
  '<td><%= userName %></td>' +
  '<td><%= signupStart %></td>' +
  '<td><%= signupEnd %></td>' +
  '<td></td>' + // fill in TODO
  '</tr>'
);

var signupsTableTemplate = _.template(
  '<table class="table">' +
  '<thead>' +
  '<tr>' +
  '<th>User Name</th>' +
  '<th>Start Time</th>' +
  '<th>End Time</th>' +
  '<th>Change Signup Status</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="signupsTable<%= eventID %> ">' +
  '</tbody>' +
  '</table>'
);

var compiled = _.template(
  "<div class='post'>" +
  "<h2><%= name %></h2>" +
  "<p><%= body %></p>" +
  "<p><%= dislikes %></p>" +
  "<div class='comments'><%= (function() { return comments.join('<br /><br />') })() %> </div>" +
  "</div>"
);
