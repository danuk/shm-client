angular
  .module('theme.core.directives')
  .directive('wijets', ['wijetsService', '$rootScope', '$timeout', function(wijetsService, $rootScope, $timeout) {
    'use strict';
    return {
      restrict: 'A',
      link: function() {
        $rootScope.$on('$routeChangeSuccess', function() {
          $timeout(function () {
            wijetsService.make();
          }, 100);
        });
      }
    };
  }])
  .directive('disableAnimation', ['$animate', function($animate) {
    'use strict';
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        $attrs.$observe('disableAnimation', function(value) {
          $animate.enabled(!value, $element);
        });
      }
    };
  }])
  .directive('slideOut', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        show: '=slideOut'
      },
      link: function(scope, element) {
        element.hide();
        scope.$watch('show', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            element.slideToggle({
              complete: function() {
                scope.$apply();
              }
            });
          }
        });
      }
    };
  })
  .directive('slideOutNav', ['$timeout', function($t) {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        show: '=slideOutNav'
      },
      link: function(scope, element) {
        scope.$watch('show', function(newVal) {
          if (angular.element('body').hasClass('sidebar-collapsed')) {
            if (newVal === true) {
              element.css('display', 'block');
            } else {
              element.css('display', 'none');
            }
            return;
          }
          if (newVal === true) {
            element.slideDown({
              complete: function() {
                $t(function() {
                  scope.$apply();
                });
              },
              duration: 100
            });
          } else if (newVal === false) {
            element.slideUp({
              complete: function() {
                $t(function() {
                  scope.$apply();
                });
              },
              duration: 100
            });
          }
        });
      }
    };
  }])
  .directive('autocollapse', ['$window', function($window) {
    'use strict';
    return {
      link: function(scope, element) {
        function autocollapse () {
          var navbar = $('header.navbar');
          var menu = $('header.navbar .navbar-collapse');

          $('body').removeClass('topnav-collapsed');
          $('#topnav .navbar-left').addClass('in');
          $('#navbar-links-toggle').parent('li').hide();
          $(menu).insertAfter('header.navbar .logo-area');

          if((navbar.innerHeight() > 56) || ($(window).innerWidth()<786)) { // check if we've got 2 lines Or less than 786px
              $('body').addClass('topnav-collapsed');
              $('#topnav .navbar-left').removeClass('in');
              $('#navbar-links-toggle').parent('li').show();

              navbar.append(menu.detach());
          }
        }

        angular.element($window).resize( function () {
          autocollapse();
        });
        autocollapse();
      }
    };
  }])
  .directive('pulsate', function() {
    'use strict';
    return {
      scope: {
        pulsate: '='
      },
      link: function(scope, element) {
        // stupid hack to prevent FF from throwing error
        if (element.css('background-color') === 'transparent') {
          element.css('background-color', 'rgba(0,0,0,0.01)');
        }
        angular.element(element).pulsate(scope.pulsate);
      }
    };
  })
  .directive('prettyprint', ['$window', function($window) {
    'use strict';
    return {
      restrict: 'C',
      link: function postLink(scope, element) {
        element.html($window.prettyPrintOne(element.html(), '', true));
      }
    };
  }])
  .directive('animatedContent', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    'use strict';
    return {
      restrict: 'C',
      link: function postLink() {
        $rootScope.$on('$routeChangeSuccess', function() {
          $timeout( function () {
            angular.element('.animated-content .info-tile, .animated-content .panel, .animated-content .widget-weather, .animated-content .widget-tasks, .animated-content .alert')
            .css('visibility', 'visible')
          }, 10);
        });
      }
    };
  }])
  .directive('passwordVerify', function() {
    'use strict';
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
          var combined;

          if (scope.passwordVerify || ctrl.$viewValue) {
            combined = scope.passwordVerify + '_' + ctrl.$viewValue;
          }
          return combined;
        }, function(value) {
          if (value) {
            ctrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                ctrl.$setValidity('passwordVerify', false);
                return undefined;
              } else {
                ctrl.$setValidity('passwordVerify', true);
                return viewValue;
              }
            });
          }
        });
      }
    };
  })
  .directive('backgroundSwitcher', function() {
    'use strict';
    return {
      restrict: 'EA',
      link: function(scope, element) {
        angular.element(element).click(function() {
          angular.element('body').css('background', angular.element(element).css('background'));
        });
      }
    };
  })
  .directive('tabdrop', function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element) {
        angular.element.expr[':'].noparents = function(a,i,m){
                return angular.element(a).parents(m[3]).length < 1;
        };
        angular.element(element).filter(':noparents(.tab-right, .tab-left, .tabdrop-disabled)').tabdrop();
      }
    };
  })
  .directive('panel', function() {
    'use strict';
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        panelClass: '@',
        heading: '@',
        panelIcon: '@',
        ngDrag: '@'
      },
      templateUrl: 'templates/panel.html',
      link: function(scope, element, attrs) {
        if (attrs.ngDrag === 'true') {
          element.find('.panel-heading').attr('ng-drag-handle', '');
        }
      }
    };
  })
  .directive('toggleFullscreen', ['$window', function($window) {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element) {
        angular.element(element).click(function() {
          if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
              if ($window.document.documentElement.requestFullScreen) {
                  $window.document.documentElement.requestFullScreen();
              } else if ($window.document.documentElement.mozRequestFullScreen) {
                  $window.document.documentElement.mozRequestFullScreen();
              } else if ($window.document.documentElement.webkitRequestFullScreen) {
                  $window.document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
              } else if ($window.document.documentElement.msRequestFullscreen) {
                  $window.document.documentElement.msRequestFullscreen();
              }
          } else {
              if ($window.document.cancelFullScreen) {
                  $window.document.cancelFullScreen();
              } else if ($window.document.mozCancelFullScreen) {
                  $window.document.mozCancelFullScreen();
              } else if ($window.document.webkitCancelFullScreen) {
                  $window.document.webkitCancelFullScreen();
              } else if ($window.document.msExitFullscreen) {
                  $window.document.msExitFullscreen();
              }
          }
        });
      }
    };
  }])
  .directive('icheck', ['$timeout', function($timeout) {
    'use strict';
    return {
      require: '?ngModel',
      link: function($scope, element, $attrs, ngModel) {
        return $timeout(function() {
          var parentLabel = element.parent('label');
          if (parentLabel.length) {
            parentLabel.addClass('icheck-label');
          }
          var value;
          value = $attrs.value;

          $scope.$watch($attrs.ngModel, function() {
            angular.element(element).iCheck('update');
          });

          return angular.element(element).iCheck({
            checkboxClass: $attrs.icheck.length? 'icheckbox_'+$attrs.icheck:'icheckbox_minimal-blue',
            radioClass: $attrs.icheck.length? 'iradio_'+$attrs.icheck:'iradio_minimal-blue'
          }).on('ifChanged', function(event) {
            if (angular.element(element).attr('type') === 'checkbox' && $attrs.ngModel) {
              $scope.$apply(function() {
                return ngModel.$setViewValue(event.target.checked);
              });
            }
            if (angular.element(element).attr('type') === 'radio' && $attrs.ngModel) {
              return $scope.$apply(function() {
                return ngModel.$setViewValue(value);
              });
            }
          });
        });
      }
    };
  }])
  .directive('knob', function() {
    'use strict';
    return {
      restrict: 'EA',
      template: '<input class="dial" type="text"/>',
      scope: {
        options: '='
      },
      replace: true,
      link: function(scope, element) {
        angular.element(element).knob(scope.options);
      }
    };
  })
  .directive('uiBsSlider', ['$timeout', function($timeout) {
    'use strict';
    return {
      link: function(scope, element) {
        // $timeout is needed because certain wrapper directives don't
        // allow for a correct calculation of width
        $timeout(function() {
          element.slider();
        });
      }
    };
  }])
  .directive('tileLarge', function() {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        item: '=data'
      },
      templateUrl: 'templates/tile-large.html',
      replace: true,
      transclude: true
    };
  })
  .directive('stickyScroll', function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        function stickyTop() {
          var topMax = parseInt(attr.stickyScroll);
          var headerHeight = angular.element('header').height();
          if (headerHeight > topMax) {
            topMax = headerHeight;
          }
          if (angular.element('body').hasClass('static-header') === false) {
            return element.css('top', topMax + 'px');
          }
          var windowTop = angular.element(window).scrollTop();
          if (windowTop < topMax) {
            element.css('top', (topMax - windowTop) + 'px');
          } else {
            element.css('top', 0 + 'px');
          }
        }

        angular.element(function() {
          angular.element(window).scroll(stickyTop);
          stickyTop();
        });
      }
    };
  })
  .directive('rightbarRightPosition', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        isFixedLayout: '=rightbarRightPosition'
      },
      link: function(scope) {
        scope.$watch('isFixedLayout', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            setTimeout(function() {
              var $pc = angular.element('#wrapper');
              var endingRight = (angular.element(window).width() - ($pc.offset().left + $pc.outerWidth()));
              if (endingRight < 0) {
                endingRight = 0;
              }
              angular.element('.infobar').css('right', endingRight);
            }, 100);
          }
        });
      }
    };
  })
  .directive('loadAsModal', ['$bootbox', function($bootbox) {
    'use strict';
    return {
      restrict: 'AE',
      link: function(scope, element) {
        element.click( function (event) {
          event.preventDefault();
          var img = element.attr('src');
          var imgname = element.closest('.item-wrapper').attr('data-name');

          $bootbox.dialog({
              message: '<img src="' + img + '" class="img-responsive" />',
              title: imgname,
              buttons: {
                  close: {
                      label: 'Close',
                      className: 'btn-default'
                  }
              }
          });

          angular.element('.modal .bootbox-close-button').hide();
        })
      }
    };
  }])
  .directive('backToTop', function() {
    'use strict';
    return {
      restrict: 'AE',
      link: function(scope, element) {
        element.click(function() {
          angular.element('body').scrollTop(0);
        });
      }
    };
  })
  .directive('toTopOnLoad', ['$rootScope', function($rootScope) {
    'use strict';
    return {
      restrict: 'AE',
      link: function() {
        $rootScope.$on('$routeChangeSuccess', function() {
          angular.element('body').scrollTop(0);
        });
      }
    };
  }])
  .directive('fauxOffcanvas', ['EnquireService', '$window', function(EnquireService, $window) {
    'use strict';
    return {
      restrict: 'AE',
      link: function() {
        EnquireService.register('screen and (max-width: 767px)', {
            match : function() {  //smallscreen
                angular.element('body').addClass('sidebar-collapsed');

                setWidthtoContent();
                angular.element(window).on('resize', setWidthtoContent);
            },
            unmatch : function() {  //bigscreen
                angular.element('body').removeClass('sidebar-collapsed');

                angular.element('.static-content').css('width','');
                angular.element($window).off('resize', setWidthtoContent);
            }
        });
            
        function setWidthtoContent() {
            var w = angular.element('#wrapper').innerWidth();
            angular.element('.static-content').css('width',(w)+'px');
        }
      }
    };
  }])
  .directive('scrollToBottom', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        model: '=scrollToBottom'
      },
      link: function(scope, element) {
        scope.$watch('model', function(n, o) {
          if (n !== o) {
            element[0].scrollTop = element[0].scrollHeight;
          }
        });
      }
    };
  });
 
