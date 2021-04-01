angular
    .module('shm_user', [
])
.controller('ShmUserController',
    ['$scope','$location','$route','shm_request','shm_pays', function($scope, $location, $route, shm_request, shm_pays) {
    'use strict';

    shm_request('GET','v1/user' ).then(function(response) {
        $scope.data = response.data[0];
    });

    $scope.save = function() {
        shm_request('POST_JSON','v1/user', $scope.data ).then(function() {
            $location.path('/user');
        })
    }

    $scope.pay = function() {
        shm_pays.make_pay().result.then(function(data){
        }, function(cancel) {
        });
    };

}]);

