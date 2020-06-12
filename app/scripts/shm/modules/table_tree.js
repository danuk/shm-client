angular
.module('shm_table_tree', [
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.resizeColumns',
        'ui.grid.autoResize',
        'ui.grid.pagination',
        'ui.grid.moveColumns',
        'ui.grid.pinning',
        'ui.grid.cellNav',
        'ui.grid.treeView',
    ])
    .controller('ShmTableTreeController', ['$scope', '$filter', '$http', 'uiGridTreeViewConstants', 'shm_request', function(
            $scope, $filter, $http, uiGridTreeViewConstants, shm_request) {
        'use strict';

        $scope.gridScope = $scope;

        $scope.gridOptions = {
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableGridMenu: true,
            noUnselect: true,
            showTreeExpandNoChildren: true,
            enableExpandAll: false,
            gridMenuCustomItems: [
                {
                    title: 'Reload',
                    action: function ($event) {
                        $scope.load_data($scope.url);
                    },
                    order: 210
                }
            ],
        };

        $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {
                var index = $scope.gridOptions.data.indexOf(row.entity);
                var treeLevel = 1;
                console.log('ROW:', row );
                if ( row.treeLevel ) { treeLevel = row.treeLevel + 1 };
                if ( !row.treeNode.children.length ) {
                    shm_request('GET','/'+$scope.url, { parent: row.entity[$scope.parent_key_id] } ).then(function(response) {
                        var data = response.data;
                        data.forEach(function(childRow) {
                            if ( $scope.maxDeepLevel > treeLevel ) { childRow.$$treeLevel = treeLevel };
                            $scope.gridOptions.data.splice(++index, 0, childRow);
                        })
                        $scope.gridApi.selection.unSelectRow(row.entity);
                    })
                }
            });
        };

        if ( $scope.row_dbl_click ) {
            $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.appScope.row_dbl_click(row.entity)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div>';
        }

        $scope.load_data = function(url) {
            shm_request('GET','/'+url).then(function(response) {
                var largeLoad = response.data;

                if ( $scope.columnDefs ) {
                    var row = largeLoad[0];

                    for ( var field in row ) {
                        var found = 0;
                        $scope.columnDefs.forEach(function(item) {
                            if ( item.field == field ) { found = 1; return; };
                        })
                        if ( !found ) { $scope.columnDefs.push( { field: field, visible: false } ) };
                    }
                    $scope.gridOptions.columnDefs = $scope.columnDefs;
                }

                largeLoad.forEach(function(item) {
                    item.$$treeLevel = 0;
                })

                $scope.setPagingData(largeLoad, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize );
            })
        }

        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSize: 1000,
            currentPage: 1
        };
        $scope.setPagingData = function(data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.gridOptions.data = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function(url,pageSize, page, searchText) {
            setTimeout(function() {
                var data;
                if (searchText) {
                    /*var ft = searchText.toLowerCase();
                    shm_request('GET','/'+url).then(function(response) {
                        data = largeLoad.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                            });
                        $scope.setPagingData(data, page, pageSize);
                    });*/
                } else {
                     shm_request('GET','/'+url).then(function(response) {
                         var largeLoad = response.data;
                         $scope.setPagingData(largeLoad, page, pageSize);
                     });
                }
            }, 100);
        };

        //$scope.getPagedDataAsync($scope.url, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        $scope.load_data($scope.url);

        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
    }])
    .directive('shmTableTree', function() {
        return {
            controller: 'ShmTableTreeController',
            template: '<div style="height: 512px;" ui-grid="gridOptions" ui-grid-selection ui-grid-resize-columns ui-grid-auto-resize ui-grid-move-columns ui-grid-pinning ui-grid-tree-view></div>',
        }
    });

