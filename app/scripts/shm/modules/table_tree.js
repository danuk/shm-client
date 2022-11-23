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
    .controller('ShmTableTreeController',
        ['$scope', '$filter', '$timeout', '$interval', 'shm_request', 'uiGridConstants',
            function($scope, $filter, $timeout, $interval, shm_request, uiGridConstants) {
        'use strict';

        var paginationOptions = {
            offset: 0,
            limit: 25,
        };

        var filteringData = {};
        var delay_request = false;

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
            useExternalPagination: true,
            paginationPageSizes: [25, 50, 100],
            paginationPageSize: paginationOptions.limit,
        };

        $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {
                var index = $scope.gridOptions.data.indexOf(row.entity);
                var treeLevel = 1;
                if ( row.treeLevel ) { treeLevel = row.treeLevel + 1 };
                if ( !row.treeNode.children.length ) {
                    var args = angular.merge(
                        paginationOptions,
                        {
                            filter: angular.toJson( filteringData ),
                            parent: row.entity[$scope.parent_key_id],
                        },
                    );
                    shm_request('GET', $scope.url, args ).then(function(response) {
                        var data = response.data.data;
                        data.forEach(function(childRow) {
                            if ( $scope.maxDeepLevel > treeLevel ) { childRow.$$treeLevel = treeLevel };
                            $scope.gridOptions.data.splice(++index, 0, childRow);
                        })
                        $scope.gridApi.selection.unSelectRow(row.entity);
                    })
                }
            });

            $scope.gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                if ( !delay_request ) {
                    delay_request = true;
                    $timeout(function() {
                        filteringData = {};
                        angular.forEach( grid.columns, function( col ) {
                            if ( col.filters[0].term ) {
                                filteringData[col.field] = col.filters[0].term;
                            }
                        });
                        delay_request = false;
                        $scope.load_data($scope.url);
                    },1000);
                }
            });

            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                    delete paginationOptions.sort_field;
                    delete paginationOptions.sort_direction;
                } else {
                    paginationOptions.sort_field = sortColumns[0].field;
                    paginationOptions.sort_direction = sortColumns[0].sort.direction;
                }
                $scope.load_data($scope.url);
            });

            gridApi.pagination.on.paginationChanged($scope, function (pageNum, pageSize) {
                paginationOptions.offset = ( pageNum -1 ) * pageSize ;
                paginationOptions.limit = pageSize;
                $scope.load_data($scope.url);
            });
        };
        if ( $scope.row_dbl_click ) {
            $scope.gridOptions.rowTemplate = '<div ng-dblclick="grid.appScope.row_dbl_click(row.entity)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div>';
        }

        $scope.load_data = function(url) {
            var args = angular.merge(
                paginationOptions,
                {
                    filter: angular.toJson( filteringData ),
                    parent: null,
                },
            );

            shm_request('GET', url, args).then(function(response) {
                var largeLoad = response.data.data;

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
                $scope.gridOptions.totalItems = response.data.items;
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
                     shm_request('GET', url).then(function(response) {
                         var largeLoad = response.data;
                         $scope.setPagingData(largeLoad, page, pageSize);
                     });
                }
            }, 100);
        };

        //$scope.getPagedDataAsync($scope.url, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        $scope.load_data($scope.url);

        // Auto refresh data
        var timerId = $interval(function() {
            var tree_by_usi = {};
            $scope.gridOptions.data.forEach(function(item) {
                tree_by_usi[ item.user_service_id ] = item;
            });

            var args = angular.merge(
                paginationOptions,
                {
                    filter: angular.toJson( filteringData ),
                    parent: null,
                },
            );
            shm_request('GET', $scope.url, args).then(function(response) {
                var largeLoad = response.data.data;

                largeLoad.forEach(function(item) {
                    if ( tree_by_usi[ item.user_service_id ] ) {
                        angular.merge( tree_by_usi[ item.user_service_id ], item );
                    }
                })
            });
        }, 3000);

        $scope.$on( "$destroy", function() {
            if ( timerId ) { $interval.cancel( timerId ) };
        });

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
        $scope.$watch('gridOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            }
        }, true);
    }])
    .directive('shmTableTree', function() {
        return {
            controller: 'ShmTableTreeController',
            template: '<div style="height: 512px;" ui-grid="gridOptions" ui-grid-selection ui-grid-resize-columns ui-grid-auto-resize ui-grid-move-columns ui-grid-pinning ui-grid-tree-view ui-grid-pagination></div>',
        }
    });

