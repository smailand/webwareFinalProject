var myEventsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Event Date</th>' +
  '<th>Signup Start</th>' +
  '<th>Signup End</th>' +
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
  '<td><%= eventDate.toISOString().substring(0, 10) %></td>' +
  '<td><%= shiftStart %></td>' +
  '<td><%= shiftEnd %></td>' +
  '<td><%= organizerName %></td>' +
  '<td><%= approvalStatus %></td>' +
  '<td><button class="btn btn-danger btn-sm" type="button" onclick=removeSignup(event)>Remove Signup</button></td>' +
  '</tr>'
);
