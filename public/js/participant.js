function logout() {
  // remove user id from session storage
  sessionStorage.removeItem('participantID');
  window.location = '/';
}

function initializePage() {
  userID = sessionStorage.getItem('participantID');
  if (userID === null) {
    window.location = "/";
  }
  console.log(sessionStorage.getItem('participantID'));
}
