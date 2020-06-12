angular
  .module('theme.core.notifications_controller', [])
  .controller('NotificationsController', ['$scope', '$filter', function($scope, $filter) {
    'use strict';
    $scope.notifications = [{
      text: 'Profile page has been updated',
      time: '8 mins ago',
      class: 'notification-success',
      iconClasses: 'ti ti-pencil',
      seen: true
    }, {
      text: 'Update pushed successfully',
      time: '24 mins ago',
      class: 'notification-info',
      iconClasses: 'ti ti-check',
      seen: false
    }, {
      text: 'New users requested to join',
      time: '16 hours ago',
      class: 'notification-teal',
      iconClasses: 'ti ti-user',
      seen: false
    }, {
      text: 'More Orders Pending',
      time: '2 days ago',
      class: 'notification-indigo',
      iconClasses: 'ti ti-shopping-cart',
      seen: false
    }, {
      text: 'Initial Release 1.0',
      time: '4 days ago',
      class: 'notification-danger',
      iconClasses: 'ti ti-arrow-up',
      seen: false
    }, ];

    $scope.setSeen = function(item, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      item.seen = true;
    };

    $scope.setUnseen = function(item, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      item.seen = false;
    };

    $scope.setSeenAll = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      angular.forEach($scope.notifications, function(item) {
        item.seen = true;
      });
    };

    $scope.unseenCount = $filter('filter')($scope.notifications, {
      seen: false
    }).length;

    $scope.$watch('notifications', function(notifications) {
      $scope.unseenCount = $filter('filter')(notifications, {
        seen: false
      }).length;
    }, true);
  }]);