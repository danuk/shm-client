angular
  .module('shm_user_services', [
  ])
  .service('shm_user_services', [ '$q', '$modal', 'shm_request', function( $q, $modal, shm_request ) {
    this.add = function(data) {
        return $modal.open({
            templateUrl: 'views/user_service_order.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = 'Регистрация новой услуги';
                $scope.data = {};
                $scope.service = {
                    service_id: "-1",
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.reg = function (service) {
                    shm_request('PUT_JSON', 'v1/service/order', service ).then(function(response) {
                        $modalInstance.close( response.data.data[0] );
                    });
                };
            },
            size: 'lg',
        });
    };

    var getTemplateUrl = function(category) {
        var http = new XMLHttpRequest();
        var base_url = 'views/shm/categories/';
        http.open('HEAD', base_url + category + '.html', false);
        http.send();
        return (http.status !== 404) ? base_url + category + '.html' : base_url + 'default.html';
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: function (rp) {
                return getTemplateUrl(row.category);
            },
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.data = angular.copy(row);

                if (!row.services.config) row.services.config = {};
                $scope.data.btn_delete = ( row.status == 'BLOCK' || row.status == 'ACTIVE' ) ? 1 : 0;

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    $modalInstance.close( $scope.data );
                };

                $scope.block = function(data) {
                    $modalInstance.dismiss('block');
                };

                $scope.delete = function () {
                    if (confirm("Удалить услугу?")) {
                        $modalInstance.dismiss('delete');
                    }
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
            displayName: 'Услуга',
            cellTemplate: '<div class="ui-grid-cell-contents">[{{row.entity.user_service_id}}] {{row.entity.name}}</div>',
            width: "50%",
        },
        {
            field: 'status',
            displayName: 'Статус',
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
            field: 'expire',
            displayName: 'Истекает',
        },
    ];

    var save_service = function( row, save_data ) {
        delete save_data.status; // protect for change status
        shm_request('POST_JSON', url, save_data ).then(function(response) {
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
            if ( resp === 'block' ) {
                shm_request('POST_JSON','v1/user/service/stop', { user_id: row.user_id, user_service_id: row.user_service_id } ).then(function(response) {
                    if (response.data.data.length) {
                        angular.extend( row, response.data.data[0] );
                    } else {
                        $scope.gridOptions.data.splice(
                            $scope.gridOptions.data.indexOf( row ),
                            1
                        );
                    }
                }, function( response ) {
                    if ( response.data && response.data.error ) {
                        alert( "Error: " + response.data.error );
                    }
                })
            }
            if ( resp === 'delete' ) {
                shm_request('DELETE', url, { user_id: row.user_id, user_service_id: row.user_service_id } ).then(function(response) {
                    if (response.data.data.length) {
                        angular.extend( row, response.data.data[0] );
                    } else {
                        $scope.gridOptions.data.splice(
                            $scope.gridOptions.data.indexOf( row ),
                            1
                        );
                    }
                }, function( response ) {
                    if ( response.data && response.data.error ) {
                        alert( "Error: " + response.data.error );
                    }
                })
            }
        });
    }

  }]);
