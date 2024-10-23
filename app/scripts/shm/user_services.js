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
                    service_id: "",
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.reg = function (service) {
                    service.months = service.period || 1;
                    shm_request('PUT_JSON', 'v1/service/order', service ).then(function(response) {
                        $modalInstance.close( response.data.data[0] );
                    });
                };
            },
            size: 'lg',
        });
    };

    var getTemplateUrl = function(category) {

        if (category.startsWith('vpn-mz')) {
            category = 'marz';
        } else if (category.startsWith('vpn-marz')) {
            category = 'marz';
        } else if (category.match(/marz|mz|marzban/)) {
            category = 'marz';
        } else if (category.startsWith('vpn')) {
            category = 'vpn';
        }
        var http = new XMLHttpRequest();
        var base_url = 'views/shm/categories/';
        http.open('HEAD', base_url + category + '.html', false);
        http.send();
        return (http.status !== 404) ? base_url + category + '.html' : base_url + 'default.html';
    };

    var getSubUrl= function(user_service_id) {
        return shm_request('GET', 'v1/storage/manage/vpn_mrzb_' + user_service_id + '?format=json')
            .then(function(response) {
                return response.data.subscription_url;
            });
    };

    var getData= function(user_service_id) {
        return shm_request('GET', 'v1/storage/manage/vpn' + user_service_id)
            .then(function(resp) {
                return resp.data;
            });
    };

    this.editor = function (title, row, size) {
        return $modal.open({
            templateUrl: function (rp) {
                var category = row.category;
                return getTemplateUrl(category);
            },
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title;
                $scope.row = row;
                $scope.data = angular.copy(row);
                $scope.copied = false;

                getSubUrl($scope.data.user_service_id).then(function(subscriptionUrl) {
                    $scope.subscriptionUrl = subscriptionUrl;
                });

                $scope.CopyUrl = function () {
                if ($scope.subscriptionUrl) {
                    navigator.clipboard.writeText($scope.subscriptionUrl)
                    $scope.copied = true;

                    setTimeout(function() {
                        $scope.copied = false;
                    }, 500);

                } else {
                    alert('Ссылка не найдена');
                }
                };

                $scope.copied = false;

                $scope.openQrModal = function () {
                    $modal.open({
                        templateUrl: 'views/shm/categories/qr.html',
                        controller: function ($scope, $modalInstance, userServiceData) {
                            $scope.title = 'QR-код';
                            $scope.data = userServiceData;

                            getSubUrl($scope.data.user_service_id).then(function(SubUrl) {
                                if (SubUrl) {
                                    var qrElement = document.getElementById("qrcode");
                                    new QRCode(qrElement, SubUrl);
                                } else {
                                    getData($scope.data.user_service_id).then(function(UsData) {
                                        var qrElement = document.getElementById("qrcode");
                                        new QRCode(qrElement, UsData);
                                    });
                                }
                            });

                            $scope.closeQrModal = function () {
                                $modalInstance.close();
                            };
                        },
                        size: 'sm',
                        resolve: {
                            userServiceData: function () {
                                return $scope.data;
                            }
                        }
                    });
                };

                if (!row.services.config) row.services.config = {};

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
