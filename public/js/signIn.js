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
    userName: emailAddr,
    userEmail: userName,
    userType: participantType
  };

  userDetails = JSON.stringify(userDetails);

  handleXMLHTTPPost('/createUser', userDetails, function(resBody) {
    if (resBody.detail) {
      // parse Email
      emailAddress = "<user email>"; // TODO
      signInError = document.getElementById("signInError");

      signInError.innerHTML = "Email address is already taken. Try another.";
      signInError.hidden = false;
    } else {
      var userEmailVar = {
        userEmail: emailAddr
      };


        userEmailVar = JSON.stringify(userEmailVar);
      // send login request
      handleXMLHTTPPost('/login', userEmailVar, function(resBody) {
        if (resBody.userId) {
          // set session storage
          sessionStorage.setItem("userID", resBody.userId);
          window.location = '/eventDetails';
        } else {
          console.log(resBody)
        }
      });



    }
  });

}

function signInClicked() {
  // check if email is there

  // if  not there
  signInError = document.getElementById("signInError");
  signInError.hidden = false;
  console.log("Signin failed");
}

function handleXMLHTTPPost(postTo, postText, callbackFunc) {
  console.log("posting " + postText)
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callbackFunc(xmlHttp.responseText);
    }
  };
  xmlHttp.open("POST", postTo, true); // true for asynchronous

  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send(postText);
}
