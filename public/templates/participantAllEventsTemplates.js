var eventsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Event Name</th>' +
  '<th>Event Date</th>' +
  '<th>Event Start</th>' +
  '<th>Event End</th>' +
  '<th>Organizer Name</th>' +
  '<th>Organizer Email</th>' +
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
  '<td><%= organizerName %></td>' +
  '<td><%= organizerEmail %></td>' +
  '</tr>'
);
