angular.module('shm_pay_systems_select', [
])
  .directive('paySystemsList', [ '$modal', 'shm_request', function( $modal, shm_request ) {
    return {
      restrict: 'E',
      scope: {
        id: '='
      },
      controller: function ($scope, $element, $attrs) {
      },
      templateUrl: "views/shm/modules/pay-systems-list/select.html"
    }
  }])
;
