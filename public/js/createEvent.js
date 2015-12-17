function fetchDataForPage() {
  recurrence = document.getElementById("recurrenceDropdown");
  recurrence.addEventListener("change", recurrenceChanged)
}

function recurrenceChanged(e) {
  recurrence = document.getElementById("recurrenceDropdown");
  recurrenceVal = parseInt(recurrence.options[recurrence.selectedIndex].value);
  console.log('recurrenceVal')
  console.log(recurrenceVal);
  if (recurrenceVal === 0) {
    recurrenceEnd = document.getElementById('eventReccurrenceEndBox');
    recurrenceEnd.required = false;
    recurrenceDiv = document.getElementById('recurrenceEndDiv');
    recurrenceDiv.setAttribute("hidden", true);
  } else {
    recurrenceDiv = document.getElementById('recurrenceEndDiv');
    recurrenceDiv.hidden = false;
    recurrenceEnd = document.getElementById('eventReccurrenceEndBox');
    recurrenceEnd.required = true;
  }
}

function submit(e) {
  // check recurrence type
  recurrence = document.getElementById("recurrenceDropdown");
  recurrenceVal = parseInt(recurrence.options[recurrence.selectedIndex].value);

  // get date from start date
  startDate = "";

  if (!date2AfterDate1(new Date(), startDate) {
    // invalid date
  }

  if (recurrenceVal > 0) {

  }


//
//   < input type = "text"
//   name = 'eventName'
//   class = "form-control"
//   id = "eventNameBox"
//   placeholder = "Event Name"
//   required >
//     < textarea type = "text"
//   rows = 5 name = 'eventDetails'
//   class = "form-control"
//   id = "eventDetailsBox"
//   placeholder = "Event Details"
//   required > < /textarea> < input type = "number"
//   name = 'eventCapacity'
//   min = "1"
//   class = "form-control"
//   id = "capacityBox"
//   placeholder = "Number of Participants" >
//     < select id = "recurrenceDropdown"
//   name = 'recurrentDropdown'
//   class = "form-control" >
//     < option value = 0 > None < /option> < option value = 1 > Weekly < /option> < option value = 2 > Monthly < /option> < input type = "date"
//   name = 'eventStartBox'
//   class = "form-control"
//   id = "eventStartBox"
//   required >
//     < input type = "date"
//   name = 'recurrenceEnd'
//   class = "form-control"
//   id = "eventReccurrenceEndBox" >
//     < select id = "eventStartHour"
//   name = "eventStartHour"
//   class = "form-control" >
//     < select id = "eventStartMinute"
//   name = "eventStartMinute"
//   class = "form-control" >
//     < select id = "eventStartAMPM"
//   name = "eventStartAMPM"
//   class = "form-control" >
//     < option > AM < /option> < option > PM < /option> < select id = "eventEndHour"
//   name = "eventEndHour"
//   class = "form-control" >
//     < select id = "eventEndMinute"
//   name = "eventEndMinute"
//   class = "form-control" >
//     < select id = "eventEndAMPM"
//   name = "eventEndAMPM"
//   class = "form-control" >
//
//
//
//     >
//     < div id = "signInError"
//   class = "alert alert-warning"
//   role = "alert"
//   hidden >
//
//
//
//
//
//
//     < div class = "col-md-12" >
//     < div class = "floatRight" >
//     < button type = "button"
//   class = "btn btn-default" > Discard Event < /button> < button type = "submit"
//   class = "btn btn-primary"
//   onclick = "submit(event)" > Create Event < /button>
//
//
//
//
}

function date2AfterDate1(date1, date2) {
  if ((date1 - date2) >= 0) {
    return false;
  }
  return true;
}
