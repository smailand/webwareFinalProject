function fetchDataForPage() {
  recurrence = document.getElementById("recurrenceDropdown");
  recurrence.addEventListener("change", recurrenceChanged);
  console.log("HEREEEE")

  eventStartBox = document.getElementById('eventStartBox');
  dateToday = new Date();
  dateToday.setDate(dateToday.getDate() + 1)
  eventStartBox.value = dateToday.toISOString().substring(0, 10);

  eventReccurrenceEndBox = document.getElementById('eventReccurrenceEndBox');
  eventReccurrenceEndBox.value = dateToday.toISOString().substring(0, 10);

  form = document.getElementById('newEventForm');
  form.addEventListener('submit', function(event) {
    console.log('submitting');
    checkCreateEvent();
    event.preventDefault();
  });

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

function checkCreateEvent() {
  console.log("checking stuff");
  errorMsgPane = document.getElementById('createError');
  errorMsgPane.innerHTML = "";
  errorMsgPane.hidden = true;

  // check recurrence type
  recurrence = document.getElementById("recurrenceDropdown");
  recurrenceVal = parseInt(recurrence.options[recurrence.selectedIndex].value);

  // get date from start date
  eventStartBox = document.getElementById('eventStartBox');
  startDate = new Date(eventStartBox.value);

  if (!date2AfterDate1(new Date(), startDate)) {
    errorMsgPane.innerHTML = "Start date must occur after the current date."
    errorMsgPane.hidden = false;
    return;
  }

  if (recurrenceVal > 0) {
    eventReccurrenceEndBox = document.getElementById('eventReccurrenceEndBox');
    endDate = new Date(eventReccurrenceEndBox.value);
    if (!date2AfterDate1(startDate, endDate)) {
      errorMsgPane.innerHTML = "Reccurrence end date must occur after the event start date."
      errorMsgPane.hidden = false;

      return;
    }
  }

  startHourBox = document.getElementById("eventStartHour");
  startHourText = startHourBox.options[startHourBox.selectedIndex].text;
  startMinuteBox = document.getElementById("eventStartMinute");
  startMinuteText = startMinuteBox.options[startMinuteBox.selectedIndex].text;
  startAMPMBox = document.getElementById("eventStartAMPM");
  startAMPMText = startAMPMBox.options[startAMPMBox.selectedIndex].text;

  endHourBox = document.getElementById("eventEndHour");
  endHourText = endHourBox.options[endHourBox.selectedIndex].text;
  endMinuteBox = document.getElementById("eventEndMinute");
  endMinuteText = endMinuteBox.options[endMinuteBox.selectedIndex].text;
  endAMPMBox = document.getElementById("eventEndAMPM");
  endAMPMText = endAMPMBox.options[endAMPMBox.selectedIndex].text;


  dateToday = new Date();
  dateToday.setDate(dateToday.getDate() + 1)
  startingTime = new Date(dateToday.toISOString().substring(0, 11) + makeTimeStringFromHourMinuteAMPM(startHourText, startMinuteText, startAMPMText));

  endingTime = new Date(dateToday.toISOString().substring(0, 11) + makeTimeStringFromHourMinuteAMPM(endHourText, endMinuteText, endAMPMText));

  if (!date2AfterDate1(startingTime, endingTime)) {
    errorMsgPane.innerHTML = "Start time must occur before the end time."
    errorMsgPane.hidden = false;
    return;
  }
  eventNameBox = document.getElementById('eventNameBox');
  eventName = eventNameBox.value;
  console.log(eventName);
  eventDetailsBox = document.getElementById('eventDetailsBox');
  eventDescription = eventDetailsBox.value;
  console.log(eventDescription);

  eventStartDate = startDate.toISOString().substring(0, 10);
  eventRecurrenceType = recurrenceVal;
  if (eventRecurrenceType === 0) {
    eventEndDate = eventStartDate;
  } else {
    eventEndDate = endDate.toISOString().substring(0, 10);
  }

  eventOwner = sessionStorage.getItem('creatorID');

  capacityBox = document.getElementById('capacityBox');
  eventCapacity = capacityBox.value;
  console.log(eventCapacity);

  eventStartTime = startingTime.toISOString().substring(11, 19);
  eventEndTime = endingTime.toISOString().substring(11, 19);

  newEvent = new BrandNewEvent(eventName, eventDescription, eventStartTime, eventEndTime, eventRecurrenceType, eventStartDate, eventEndDate, eventCapacity, eventOwner);

  handleXMLHTTPPost('/createEvent', newEvent, function(responseText) {
    console.log(responseText);
    if (responseText === 'OK') {
      window.location = '/creatorHome';
    }
  });


}

function date2AfterDate1(date1, date2) {
  if ((date1 - date2) >= 0) {
    return false;
  }
  return true;
}

function makeTimeStringFromHourMinuteAMPM(hourString, minuteString, AMPMString) {
  if (AMPMString === 'PM') {
    // modify hour strings
    if (hourString !== '12') {
      hour = parseInt(hourString)
      hour += 12;
      hourString = hour.toString();
    }
  } else if (hourString === '12') {
    hourString = '00';
  }

  return hourString + ':' + minuteString + ':00'
}

function BrandNewEvent(eventName, eventDescription, eventStartTime, eventEndTime, eventRecurrenceType, eventStartDate, eventEndDate, eventCapacity, eventOwner) {
  this.eventName = eventName;
  this.eventOwnerId = eventOwner;
  this.eventDescription = eventDescription;
  this.startTime = eventStartTime;
  this.endTime = eventEndTime;
  this.recurrenceStartDate = eventStartDate;
  this.recurrenceEndDate = eventEndDate;
  this.recurrenceTypeId = eventRecurrenceType;
  this.capacity = eventCapacity;
}
