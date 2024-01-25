angular.module('shm_pay_systems_select', [
])
  .directive('paySystemsList', [ 'shm_request', function( shm_request ) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
        },
        link: function ($scope, $element, $attrs) {
            var request = 'v1/user/pay/paysystems';

            shm_request('GET', request).then(function(response) {
                var data = response.data.data;
                if (!data) return;

                $scope.items = data;
                $scope.data = data[0];
            });
        },
        templateUrl: "views/shm/modules/pay-systems-list/select.html"
    }
  }])
;
