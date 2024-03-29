angular
  .module('themesApp', [
    'theme',
    'shm_table',
    'shm_table_tree',
    'shm_user',
    'shm_services_select',
    'shm_services_order_select',
    'shm_user_services',
    'shm_user_services_select',
    'shm_pay_systems_select',
    'shm',
    'shm_request',
    'shm_withdraws',
    'shm_pays',
  ])
  .config(['$provide', '$routeProvider', function($provide, $routeProvider) {
    'use strict';
    $routeProvider
      .when('/', {
        templateUrl: 'views/user.html',
      })
      .when('/:templateFile', {
        templateUrl: function(param) {
          return 'views/' + param.templateFile + '.html';
        }
      })
      .when('#', {
        templateUrl: 'views/user.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  /*.directive('demoOptions', function () {
    return {
      restrict: 'C',
      link: function (scope, element, attr) {
        element.find('.demo-options-icon').click( function () {
          element.toggleClass('active');
        });
      }
    };
  })*/
