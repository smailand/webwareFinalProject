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
    console.log("org");
  } else {
    participantType = 1;
    console.log("particip");
  }

  // run XMLHTTPRequest

  userEmailTaken = true;

  if (userEmailTaken) {
    // parse Email
    emailAddress = "<user email>"; // TODO
    signInError = document.getElementById("signInError");

    signInError.innerHTML = "Email address " + emailAddress + " is already taken. Try another.";
    signInError.hidden = false;
  } else {
    // set session storage
    sessionStorage.setItem("userID", 12345678);
    // redirect to user home
  }

}

function signInClicked() {
  // check if email is there

  // if  not there
  signInError = document.getElementById("signInError");
  signInError.hidden = false;
  console.log("Signin failed");
}
