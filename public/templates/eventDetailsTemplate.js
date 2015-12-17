console.log('detais temp loaded');

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


var eventDetailsTemplate = _.template(
  '<form>' +
  '<div class="row">' +
  '<div class="form-group col-md-12">' +
  '<label for="eventNameBox" class="control-label">Event Name</label>' +
  '<div>' +
  '<input type="text" class="form-control"  readonly id="eventNameBox" value="<%= eventName %>">' +
  '</input>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="row">' +
  '<div class="form-group col-md-12">' +
  '<label for="eventDescriptionBox" control-label">Description</label>' +
  '<div>' +
  '<textarea type="text" rows="3" class="form-control"  readonly id="eventDescriptionBox">' +
  '<%= eventDescription %>' +
  '</textarea>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="row">' +'<div class="form-group col-md-6">' +
  '<label for="eventDateBox" class="control-label">Event Date</label>' +
  '<div>' +
  '<input type="date" class="form-control"  readonly id="eventDateBox" value=<%= eventDate.toISOString().substring(0, 10) %>>' +
  '</input>' +
  '</div>' +
  '</div>' +
  '<div class="form-group col-md-6">' +
  '<label for="eventCapacityBox" class="control-label">Capacity</label>' +
  '<div>' +
  '<input type="text" class="form-control"  readonly id="eventCapacityBox" value="<%= eventCapacity %> volunteers">' +
  '</input>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="row">' +
  '<div class="form-group col-md-6">' +
  '<label for="eventStartBox" class="control-label">Start Time</label>' +
  '<div>' +
  '<input type="text" class="form-control"  readonly id="eventStartBox" value="<%= eventStart %>">' +
  '</input>' +
  '</div>' +
  '</div>' +
  '<div class="form-group col-md-6">' +
  '<label for="eventEndBox" class="control-label">End Time</label>' +
  '<div>' +
  '<input type="text" class="form-control"  readonly id="eventEndBox" value="<%= eventEnd %>">' +
  '</input>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="row">' +
  '<div class="form-group col-md-12">' +
  '<label for="organizerNameBox" class="control-label">Organizer</label>' +
  '<div>' +
  '<input type="text" class="form-control"  readonly id="organizerNameBox" value="<%= organizerName %>">' +
  '</input>' +
  '</div>' +
  '</div>' +
  '</form>'
  // '<p>Event Name</p>' +
  // '<input type="text" class="form-control"  readonly id="eventNameBox" value="<%= eventName %>">' +
  // '</input>' +
  // '<p>Event Description</p>' +
  // '<input type="text" class="form-control"  readonly id="eventDescriptionBox" value="<%= eventDescription %>">' +
  // '</input>' +
  // '<p>Event Start</p>' +
  // '<input type="text" class="form-control"  readonly id="eventStartBox" value="<%= eventStart %>">' +
  // '</input>' +
  // '<p>Event End</p>' +
  // '<input type="text" class="form-control"  readonly id="eventEndBox" value="<%= eventEnd %>">' +
  // '</input>' +
  // '<p>Capacity</p>' +
  // '<input type="text" class="form-control"  readonly id="eventStartBox" value="<%= eventCapacity %> volunteers">' +
  // '</input>'

);

var userShiftsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Shift Start</th>' +
  '<th>Shift End</th>' +
  '<th>Approval Status</th>' +
  '<th>Remove Shift Signup</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="myShiftsTableBody">' +
  '</tbody>'
);

var userShiftsTemplate = _.template(
  '<tr id="signup<%= signupId %>">' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '<td><%= approvalStatus %></td>' +
  '<td><button class="btn btn-danger btn-xs" type="button" onclick=removeSignup(event)>Remove Signup</button></td>' +
  '</tr>'
);

var pendingSignupsTemplate = _.template(
  '<tr id="signup<%= signupId %>" >' +
  '<td><%= participantName %></td>' +
  '<td><%= participantEmail %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '<td><div class="btn-group"><button class="btn btn-danger btn-xs" type="button" onclick=denySignup(event)>Deny</button>' +
  '<button class="btn btn-success btn-xs" type="button" onclick=approveSignup(event)>Approve</button></div></td>' +
  '</tr>'
);

var approvedSignupsTemplate = _.template(
  '<tr id="signup<%= signupId %>" >' +
  '<td><%= participantName %></td>' +
  '<td><%= participantEmail %></td>' +
  '<td><%= eventStart %></td>' +
  '<td><%= eventEnd %></td>' +
  '<td><%= approvalStatus %></td>' +
  '<td></td>' +
  '</tr>'
);

var creatorShiftsTableTemplate = _.template(
  '<thead>' +
  '<tr>' +
  '<th>Name</th>' +
  '<th>Email</th>' +
  '<th>Shift Start</th>' +
  '<th>Shift End</th>' +
  '<th>Approval</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="creatorShiftsTable">' +
  '</tbody>'
);
