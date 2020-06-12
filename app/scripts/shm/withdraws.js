angular
  .module('shm_withdraws', [
  ])
  .controller('ShmWithdrawsController', ['$scope', '$modal', 'shm', 'shm_request', function($scope, $modal, shm, shm_request) {
    'use strict';

    var url = 'admin/withdraw.cgi';
    $scope.url = url;

    $scope.columnDefs = [
        {field: 'withdraw_id', displayName: "id"},
        {
            field: 'user_id',
            filter: { term: $scope.user.user_id },
        },
        {field: 'create_date', displayName: "Дата создания"},
        {field: 'withdraw_date', displayName: "Дата списания"},
        {field: 'total', displayName: "Итого"},
    ];

    $scope.service_editor = function (title, row, size) {
        return $modal.open({
            templateUrl: 'views/withdraw_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
                };

            },
            size: size,
        });
    }

    var save_service = function( row, save_data ) {
        delete save_data.$$treeLevel;
        shm_request('POST_JSON','/'+url, save_data ).then(function(response) {
            var new_data = response.data;

            angular.extend( row, new_data );
        });
    };

    $scope.add = function() {
        var row = {
            next: null,
        };

        $scope.service_editor('Создание', row, 'lg').result.then(function(data){
            shm_request('PUT_JSON','/'+url, data ).then(function(response) {
                var row = response.data;

                row.$$treeLevel = 0;
                $scope.gridOptions.data.push( row );
            });
        }, function(cancel) {
        });
    };

    /*
    $scope.row_dbl_click = function(row) {
        $scope.service_editor('Редактирование списания', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE','/'+url+'?id='+row.id ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }
    */

  }]);

