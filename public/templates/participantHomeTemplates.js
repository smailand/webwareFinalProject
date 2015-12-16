var myEventsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Event Start</th>' +
  '<th>Event End</th>' +
  '<th>Organizer Name</th>' +
  '<th>Approval Status</th>' +
  '<th>Remove Event Signup</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="myEventsTableBody">' +
  '</tbody>'
);

var mySignupsTemplate = _.template(
  '<tr id="signup<%= signupId %>" onclick="showEventDetailPage(event)">' +
  '<td><%= eventName %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '<td><%= organizerName %></td>' +
  '<td><%= approvalStatus %></td>' +
  '<td><button class="btn btn-danger btn-sm" type="button" onclick=removeSignup(event)>Remove Signup</button></td>' +
  '</tr>'
);
