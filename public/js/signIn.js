function initialize() {
  createBtn = document.getElementById("createAcct");
  createBtn.addEventListener('click', createClicked);

  signIn = document.getElementById("signIn");
  signIn.addEventListener('click', signInClicked);

}

function createClicked() {
  signIn = document.getElementById("signIn");
  signIn.remove();
  signInError = document.getElementById("signInError");
  signInError.remove();
  console.log("create cliked");

  nameHTML = '<label for="inputEmail" class="sr-only">Email address</label>' +
    '<input type="text" id="inputName" class="form-control" placeholder="Name" >';

  nameHTML += '<div class="form-group"> ' +
    '<div class="radio">' +
    '<label>' +
    '<input type="radio" name="optionsRadios" id="optionsRadios1" value="participant">' +
    'Participant' +
    '</label>' +
    '</div>' +
    '<div class="radio">' +
    '<label>' +
    '<input type="radio" name="optionsRadios" id="optionsRadios2" value="organizer">' +
    'Organizer' +
    '</label>' +
    '</div>' +
    '</div>';

  wholeForm = document.getElementById('createAcctDetails');
  wholeForm.innerHTML = nameHTML;



}

function signInClicked() {
  // check if email is there

  // if  not there
  signInError = document.getElementById("signInError");
  signInError.hidden = false;
  console.log("Signin failed");
}
