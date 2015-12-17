var eventsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Event Date</th>' +
  '<th>Start Time</th>' +
  '<th>End Time</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="eventsTableBody">' +
  '</tbody>'
);

var eventsTemplate = _.template(
  '<tr id="signup<%= eventID %>" onclick="showEventDetailPage(event)">' +
  '<td><%= eventName %></td>' +
  '<td><%= eventDate.toISOString().substring(0, 10) %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '</tr>'
);
