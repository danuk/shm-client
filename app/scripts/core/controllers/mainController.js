angular.module('theme.core.main_controller', ['theme.core.services','ngCookies'])
  .controller('MainController', [
    '$rootScope',
    '$scope',
    '$theme',
    '$timeout',
    'progressLoader',
    'wijetsService',
    '$location',
    '$route',
    '$cookies',
    'shm_request',
    '$window',
    function($rootScope, $scope, $theme, $timeout, progressLoader, wijetsService, $location, $route, $cookies, shm_request, $window ) {
    'use strict';
    $scope.layoutFixedHeader = $theme.get('fixedHeader');
    $scope.layoutPageTransitionStyle = $theme.get('pageTransitionStyle');
    $scope.layoutDropdownTransitionStyle = $theme.get('dropdownTransitionStyle');
    $scope.layoutPageTransitionStyleList = ['bounce',
      'flash',
      'pulse',
      'bounceIn',
      'bounceInDown',
      'bounceInLeft',
      'bounceInRight',
      'bounceInUp',
      'fadeIn',
      'fadeInDown',
      'fadeInDownBig',
      'fadeInLeft',
      'fadeInLeftBig',
      'fadeInRight',
      'fadeInRightBig',
      'fadeInUp',
      'fadeInUpBig',
      'flipInX',
      'flipInY',
      'lightSpeedIn',
      'rotateIn',
      'rotateInDownLeft',
      'rotateInDownRight',
      'rotateInUpLeft',
      'rotateInUpRight',
      'rollIn',
      'zoomIn',
      'zoomInDown',
      'zoomInLeft',
      'zoomInRight',
      'zoomInUp'
    ];

    $scope.user = {};
	    
    if ( $window.env) {
      $scope.title = $window.env.TITLE || 'SHM Client';
    } else {
      $scope.title = 'SHM Client';
    };
	    
    $scope.layoutLoading = true;

    $scope.getLayoutOption = function(key) {
      return $theme.get(key);
    };

    $scope.setNavbarClass = function(classname, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      $theme.set('topNavThemeClass', classname);
    };

    $scope.setSidebarClass = function(classname, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      $theme.set('sidebarThemeClass', classname);
    };

    $scope.layoutFixedHeader = $theme.get('fixedHeader');
    $scope.layoutLayoutBoxed = $theme.get('layoutBoxed');
    $scope.layoutLayoutHorizontal = $theme.get('layoutHorizontal');
    $scope.layoutLeftbarCollapsed = $theme.get('leftbarCollapsed');
    $scope.layoutAlternateStyle = $theme.get('alternateStyle');

    $scope.$watch('layoutFixedHeader', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('fixedHeader', newVal);
    });
    $scope.$watch('layoutLayoutBoxed', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('layoutBoxed', newVal);
    });
    $scope.$watch('layoutLayoutHorizontal', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('layoutHorizontal', newVal);
    });
    $scope.$watch('layoutAlternateStyle', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('alternateStyle', newVal);
    });
    $scope.$watch('layoutPageTransitionStyle', function(newVal) {
      $theme.set('pageTransitionStyle', newVal);
    });
    $scope.$watch('layoutDropdownTransitionStyle', function(newVal) {
      $theme.set('dropdownTransitionStyle', newVal);
    });
    $scope.$watch('layoutLeftbarCollapsed', function(newVal, oldVal) {
      if (newVal === undefined || newVal === oldVal) {
        return;
      }
      $theme.set('leftbarCollapsed', newVal);
    });

    $scope.toggleLeftBar = function() {
      $theme.set('leftbarCollapsed', !$theme.get('leftbarCollapsed'));
    };

    $scope.$on('themeEvent:maxWidth767', function(event, newVal) {
      $timeout(function() {
          $theme.set('leftbarCollapsed', newVal);
      });
    });
    $scope.$on('themeEvent:changed:fixedHeader', function(event, newVal) {
      $scope.layoutFixedHeader = newVal;
    });
    $scope.$on('themeEvent:changed:layoutHorizontal', function(event, newVal) {
      $scope.layoutLayoutHorizontal = newVal;
    });
    $scope.$on('themeEvent:changed:layoutBoxed', function(event, newVal) {
      $scope.layoutLayoutBoxed = newVal;
    });
    $scope.$on('themeEvent:changed:leftbarCollapsed', function(event, newVal) {
      $scope.layoutLeftbarCollapsed = newVal;
    });
    $scope.$on('themeEvent:changed:alternateStyle', function(event, newVal) {
      $scope.layoutAlternateStyle = newVal;
    });

    $scope.toggleSearchBar = function($event) {
      $event.stopPropagation();
      $event.preventDefault();
      $theme.set('showSmallSearchBar', !$theme.get('showSmallSearchBar'));
    };

    $scope.toggleExtraBar = function($event) {
      $event.stopPropagation();
      $event.preventDefault();
      $theme.set('extraBarShown', !$theme.get('extraBarShown'));
    };

    $scope.isLoggedIn = false;

    $scope.logOut = function() {
      shm_request('POST', 'user/logout.cgi').then( function(response) {
          $scope.isLoggedIn = false;
          $cookies.remove('session_id');
          $location.path('/extras-login');
      });
    };

    $rootScope.$on('http_401', function (e, data) {
        if ( $scope.isLoggedIn ) $scope.logOut();
    });

    $scope.logIn = function(login, password) {
      progressLoader.start();
      progressLoader.set(50);
	  shm_request('POST', 'user/auth.cgi', { login: login, password: password } ).then( function(response) {
        if ( response.data.session_id ) {
            $scope.isLoggedIn = true;
            $location.path('/user_services');
        }
        progressLoader.end();
      }, function(error) {
            alert('Login or password incorrect!');
            progressLoader.end();
      });
	};

    $scope.userRegister = function(email, password, confirmPassword) {
      if ( password != confirmPassword ) {
        alert( "Ошибка: Пароли не совпадают!" );
        return;
      }
      shm_request('PUT', '/v1/user', { login: email, password: password } ).then( function(response) {
        $scope.logIn( email, password );
      }, function(error) {
        alert( error.data.error );
      });
    };

    $scope.passwordReset = function(email) {
      shm_request('POST', '/v1/user/passwd/reset', { email: email } ).then( function(response) {
        alert( "Письмо с новым паролем отправлено. Проверьте свою почту." );
        $location.path('/');
      }, function(error) {
        alert( error.data.error );
      });
    };

    $scope.nop = function() {
        shm_request('POST', 'nop.cgi' );
    }

    $scope.sessionCheck = function() {
        var $session_id = $cookies.get('session_id');
        if ($session_id) {
            $scope.isLoggedIn = true;
            return 1;
        }
        return 0;
    };

    $scope.$on('$routeChangeStart', function() {
      var args = $location.search();
      if ( args['partner_id'] ) {
          $cookies.put('partner_id', args['partner_id']);
      }

      if ($location.path() === '/extras-registration') return $location.path();
      if ($location.path() === '/extras-forgotpassword') return $location.path();

      if ( !$scope.sessionCheck() ) return $location.path( '/extras-login' );

      progressLoader.start();
      progressLoader.set(50);
    });

    $scope.$on('$routeChangeSuccess', function() {
      progressLoader.end();
      if ($scope.layoutLoading) {
        $scope.layoutLoading = false;
      }
      // wijetsService.make();
    });
  }]);
