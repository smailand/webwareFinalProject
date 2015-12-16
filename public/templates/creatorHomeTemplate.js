var creatorEventsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Event Start</th>' +
  '<th>Event End</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="myEventsTableBody">' +
  '</tbody>'
);

var creatorEventsTemplate = _.template(
  '<tr id="event<%= eventID %>" onclick="showEventDetailPage(event)">' + // TODO
  '<td><%= eventName %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '</tr>'
);

var pendingSignupsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Signup Start</th>' +
  '<th>Signup End</th>' +
  '<th>Participant Name</th>' +
  '<th>Participant Email</th>' +
  '<th>Remove Event Signup</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="myPendingEventsTableBody">' +
  '</tbody>'
);

var pendingSignupsTemplate = _.template(
  '<tr id="signup<%= signupId %>" >' +
  '<td><%= eventName %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '<td><%= participantName %></td>' +
  '<td><%= participantEmail %></td>' +
  '<td><div class="btn-group"><button class="btn btn-danger btn-xs" type="button" onclick=denySignup(event)>Deny</button>' +
  '<button class="btn btn-success btn-xs" type="button" onclick=approveSignup(event)>Approve</button></div></td>' +
  '</tr>'
);
