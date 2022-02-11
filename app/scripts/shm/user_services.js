angular
  .module('shm_user_services', [
  ])
  .service('shm_user_services', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.add = function(data) {
        return $modal.open({
            templateUrl: 'views/user_service_add.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Создание услуги пользователя';
                $scope.data = {};
                $scope.service = {
                    service_id: "-1",
                };

                $scope.$watch('service', function(newValue, oldValue){
                    $scope.data.cost = newValue.cost;
                });

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    shm_request('PUT_JSON', '/user/create_user_service.cgi', $scope.data ).then(function(response) {
                        $modalInstance.close( response.data );
                    });
                };

                $scope.delete = function () {
                    $modalInstance.dismiss('delete');
                };

            },
            size: 'lg',
        });
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: "views/shm/categories/" + row.category + ".html",
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

                $scope.block = function(data) {
                    shm_request('GET','/admin/user_service_stop.cgi?user_id='+data.user_id+'&user_service_id='+data.user_service_id).then(function(response) {
                        angular.extend( row, response.data );
                        angular.extend( data, response.data );
                    });
                };

                var update_status = function(data) {
                    shm_request('GET','/admin/u_s_object.cgi?user_id='+data.user_id+'&id='+data.user_service_id).then(function(response) {
                        data.status = response.data[0].status;
                        row.status = response.data[0].status;
                    });
                }

                $scope.show_event = function(data) {
                    shm_request('GET','/admin/u_s_object.cgi?user_id='+data.user_id+'&id='+data.user_service_id+'&method=spool_commands').then(function(response) {
                        var spool = response.data;
                        if ( spool.length ) {
                            shm_spool.edit( spool[0] ).result.then(function(){
                                update_status(data);
                            }, function(resp) {
                            })
                        }
                        else {
                            update_status(data);
                        }
                    })
                };

            },
            size: size,
        });
    }
  }])
  .controller('ShmUserServicesController', ['$scope', '$modal', 'shm', 'shm_request', 'shm_user_services', function($scope, $modal, shm, shm_request, shm_user_services ) {
    'use strict';

    var url = 'v1/user/service';
    $scope.url = 'v1/user/service';
    $scope.parent_key_id = 'user_service_id';
    $scope.maxDeepLevel = 2;

    $scope.columnDefs = [
        {
            field: 'name',
            cellTemplate: '<div class="ui-grid-cell-contents">[{{row.entity.user_service_id}}] {{row.entity.name}}</div>',
            width: "50%",
        },
        {
            field: 'status',
            width: 100,
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                switch(grid.getCellValue(row,col)) {
                    case 'NOT PAID':
                        return 'btn-info';
                        break;
                    case 'PROGRESS':
                        return 'btn-basic';
                        break;
                    case 'ACTIVE':
                        return 'btn-success';
                        break;
                    case 'BLOCK':
                        return 'btn-danger';
                        break;
                    case 'ERROR':
                        return 'btn-warning';
                        break;
                };
            },
        },
        {
            field: 'withdraws.cost',
            displayName: 'Стоимость',
            width: 100,
        },
        {
            field: 'expired',
        },
    ];

    var save_service = function( row, save_data ) {
        delete save_data.status; // protect for change status
        shm_request('POST_JSON','/'+url, save_data ).then(function(response) {
            angular.extend( row, response.data );
        });
    };

    $scope.add = function() {
        shm_user_services.add().result.then(function(row) {
            row.$$treeLevel = 0;
            $scope.gridOptions.data.push( row );
        }, function(resp) {
        });
    }

    $scope.row_dbl_click = function(row) {
        shm_user_services.editor('Редактирование услуги', row, 'lg').result.then(function(data){
            save_service( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                shm_request('DELETE','/'+url+'?user_id='+row.user_id+'&user_service_id='+row.user_service_id ).then(function() {
                    $scope.gridOptions.data.splice(
                        $scope.gridOptions.data.indexOf( row ),
                        1
                    );
                })
            }
        });
    }

  }]);
