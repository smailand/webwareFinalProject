function initialize() {
  createBtn = document.getElementById("createAcct");
  createBtn.addEventListener('click', createClickedOnce);

  signIn = document.getElementById("signIn");
  signIn.addEventListener('click', signInClicked);

}

function createClickedOnce() {
  signIn = document.getElementById("signIn");
  signIn.remove();
  //signInError = document.getElementById("signInError");
  //signInError.remove();

  nameHTML = '<label for="inputEmail" class="sr-only">Email address</label>' +
    '<input type="text" id="inputName" class="form-control" placeholder="Name" >';

  nameHTML += '<div class="form-group"> ' +
    '<div class="radio">' +
    '<label>' +
    '<input type="radio" name="userTypeRadios" id="participantRadio" value="participant" required>' +
    'Participant' +
    '</label>' +
    '</div>' +
    '<div class="radio">' +
    '<label>' +
    '<input type="radio" name="userTypeRadios" id="organizerRadio" value="organizer" required>' +
    'Organizer' +
    '</label>' +
    '</div>' +
    '</div>';

  wholeForm = document.getElementById('createAcctDetails');
  wholeForm.innerHTML = nameHTML;

  createBtn = document.getElementById("createAcct");
  createBtn.onclick = confirmCreate;
}

function confirmCreate() {
  emailField = document.getElementById("inputEmail");
  emailAddr = emailField.value;
  nameField = document.getElementById("inputName");
  userName = nameField.value;

  var participantType = document.querySelector('input[name = "userTypeRadios"]:checked').value;
  console.log("participantType: " + participantType);

  if (participantType === 'organizer') {
    participantType = 0;
  } else {
    participantType = 1;
  }

  // run XMLHTTPRequest

  var userDetails = {
    userName: userName,
    userEmail: emailAddr,
    userType: participantType
  };

  handleXMLHTTPPost('/createUser', userDetails, function(responseText) {
    console.log(responseText);
    if (responseText.name === 'error') {
      console.log("ERROR");
      signInError = document.getElementById("signInError");
      signInError.innerHTML = emailAddr + " is already taken. Use a different email."
      signInError.hidden = false;
      //signInError.remove();
    } else {
      signInError = document.getElementById("signInError");
      signInError.hidden = true;

      login(emailAddr);
      // var userDetails = {
      //   userEmail: emailAddr
      // }
      // handleXMLHTTPPost('/login', userDetails, function(responseText) {
      //   console.log(responseText);
      //   if (responseText.name === 'error') {
      //     console.log("ERROR");
      //   } else {
      //     sessionStorage.setItem('userID', responseText.userId);
      //     window.location = '/eventDetails'
      //   }
      // });
    }
  });


}

function signInClicked() {
  emailField = document.getElementById("inputEmail");
  emailAddr = emailField.value;

  login(emailAddr);

}

function handleXMLHTTPPost(postTo, postData, callbackFunc) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:3000" + postTo,
    "method": "POST",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b8241e93-87d3-1713-4188-5ec9c2653f79",
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": postData
  };

  $.ajax(settings).done(callbackFunc);
}

function login(emailAddress) {
  var userDetails = {
    userEmail: emailAddress
  }
  handleXMLHTTPPost('/login', userDetails, function(responseText) {
    console.log(responseText);
    if (responseText === 'ERROR: Email Not on File') {
      // check if email is there
      // if  not there
      signInError = document.getElementById("signInError");
      signInError.innerHTML = "Login email could not be found.";
      signInError.hidden = false;
      console.log("Signin failed");
      console.log("ERROR");
    } else {
      userType = responseText.userType;
      if (userType === 1) {
        sessionStorage.setItem('participantID', responseText.userId);
        console.log(sessionStorage.getItem('participantID'));
        window.location = '/participantHome';
      } else {
        sessionStorage.setItem('creatorID', responseText.userId);
        console.log(sessionStorage.getItem('creatorID'))
        window.location = '/creatorHome';
      }
    }
  });
}
