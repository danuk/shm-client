angular
  .module('theme.core.messages_controller', [])
  .controller('MessagesController', ['$scope', '$filter', function($scope, $filter) {
    'use strict';
    $scope.messages = [{
      name: 'Polly Paton',
      message: 'Uploaded all the...',
      time: '2 mins ago',
      thumb: 'assets/demo/avatar/avatar_01.png',
      read: false
    }, {
      name: 'Simon Corbett',
      message: 'I am signing...',
      time: '16 mins ago',
      thumb: 'assets/demo/avatar/avatar_02.png',
      read: false
    }, {
      name: 'Matt Tennant',
      message: 'Everything is work...',
      time: '2 hours ago',
      thumb: 'assets/demo/avatar/avatar_03.png',
      read: true
    }, {
      name: 'Alan Doyle',
      message: 'Please mail me the...',
      time: '6 hours ago',
      thumb: 'assets/demo/avatar/avatar_04.png',
      read: false
    }, {
      name: 'Polly Paton',
      message: 'Uploaded all the...',
      time: '12 hours ago',
      thumb: 'assets/demo/avatar/avatar_05.png',
      read: false
    }, {
      name: 'Simon Corbett',
      message: 'I am signing...',
      time: '2 days ago',
      thumb: 'assets/demo/avatar/avatar_06.png',
      read: false
    }, {
      name: 'Matt Tennant',
      message: 'Everything is no...',
      time: '4 days ago',
      thumb: 'assets/demo/avatar/avatar_07.png',
      read: true
    }, {
      name: 'Alan Doyle',
      message: 'Please mail me the...',
      time: '6 days ago',
      thumb: 'assets/demo/avatar/avatar_08.png',
      read: false
    }, ];

    $scope.setRead = function(item, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      item.read = true;
    };

    $scope.setUnread = function(item, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      item.read = false;
    };

    $scope.setReadAll = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      angular.forEach($scope.messages, function(item) {
        item.read = true;
      });
    };

    $scope.unseenCount = $filter('filter')($scope.messages, {
      read: false
    }).length;

    $scope.$watch('messages', function(messages) {
      $scope.unseenCount = $filter('filter')(messages, {
        read: false
      }).length;
    }, true);
  }]);