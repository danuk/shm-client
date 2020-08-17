angular
  .module('shm_pays', [
  ])
  .service('shm_pays', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.make_pay = function () {
        return $modal.open({
            templateUrl: 'views/make_pay.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = "Платежная система";

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
                };

                $scope.pay = function() {
                    $modalInstance.dismiss('cancel');

                    return $modal.open({
                        template: $scope.data.template,
                    });

                };
            },
            size: 'sm',
        });
    }

  }])
  .controller('ShmPaysController', ['$scope', '$modal', 'shm', 'shm_request','shm_pays', function($scope, $modal, shm, shm_request, shm_pays ) {
    'use strict';

    var url = 'admin/pay.cgi';
    $scope.url = url;

    $scope.columnDefs = [
        {field: 'id', displayName: "id", width: 100},
        {field: 'date', displayName: "Дата"},
        {field: 'money', displayName: "Сумма"},
    ];

    $scope.add = function() {
        shm_pays.make_pay().result.then(function(data){
        }, function(cancel) {
        });
    };

  }]);

