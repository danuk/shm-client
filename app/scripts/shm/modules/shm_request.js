angular
.module('shm_request', [])
.service('shm_request', [ '$rootScope', '$http', '$q', function( $rootScope, $http, $q ) {
    return function( $method, $url, $data ) {
      var deferred = $q.defer();
      var $request_url = 'http://shm.local/' + $url;
      var $args = {
        method: $method,
        url: $request_url,
        withCredentials: true,
      };
      if ( $data ) {
        if ( $method == 'GET' ) {
            $args['params'] = $data;
        } else {
            var args = $method.split('_');
            if ( args.length == 2 && args[1] === 'JSON' ) {
                $args['method'] = args[0];
                $args['data'] = angular.toJson( $data );
                $args['headers'] = {'Content-Type': 'application/json'};
            } else {
                $args['data'] = $.param( $data );
                $args['headers'] = {'Content-Type': 'application/x-www-form-urlencoded'};
            }
        }
      }
      $http( $args ).then(
        function successCallback(response) {
            deferred.resolve( response );
        }, function errorCallback(response) {
            if ( response.status == 401 ) {
                $rootScope.$broadcast('http_401', this);
            } else {
                if ( response.data && response.data.error ) {
                    console.error( "Error: " + response.data.error );
                } else {
                    console.error(
                        "URL: " + $request_url + "\n" +
                        "Status: " + response.status + " (" + response.statusText +  ")\n"
                    );
                }
            }
            deferred.reject( response );
        }
      );
      return deferred.promise;
    };
}]);

