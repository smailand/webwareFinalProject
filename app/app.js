'use strict';

/* App Module */

var volunteerApp = angular.module('volunteerApp', [
  'ngRoute',

  'volunteerControllers'
]);


//This is the code that's causing the problem (commented out below)

// volunteerApp.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/home', {
//         templateUrl: 'views/home.html',
//         controller: 'HomeCtrl'
//       }).
//       otherwise({
//         redirectTo: '/home'
//       });
//   }]);
