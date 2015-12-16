var eventsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Event Start</th>' +
  '<th>Event End</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="eventsTableBody">' +
  '</tbody>'
);

var eventsTemplate = _.template(
  '<tr id="signup<%= eventID %>" onclick="showEventDetailPage(event)">' +
  '<td><%= eventName %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '</tr>'
);
