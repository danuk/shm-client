angular
  .module('theme.core.signupPage', [
    'theme.core.services'
  ])
  .controller('SignupPageController', ['$scope', '$theme', function($scope, $theme) {
    'use strict';
    $theme.set('fullscreen', true);

    $scope.$on('$destroy', function() {
      $theme.set('fullscreen', false);
    });

    $scope.logIn = function() {
        $scope.$parent.logIn( $scope.login, $scope.password );
    }

  }]

);
