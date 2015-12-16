function displaySignupsInTable(listOfSignups) {
  if (listOfSignups.length !== 0) {
    tableHTML = signupsTableTemplate();

  }
}

function logout() {
  // remove user id from session storage
  sessionStorage.removeItem('userID');
  window.location = '/';
}

function initializePage() {
  sessionStorage.setItem('userID', 'ABCDEF');
}
