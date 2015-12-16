function logout() {
  // remove user id from session storage
  sessionStorage.removeItem('creatorID');
  window.location = '/';
}

function initializePage() {
  userID = sessionStorage.getItem('creatorID');
  if (userID === null) {
    window.location = "/";
  }
  console.log(sessionStorage.getItem('creatorID'));
}
