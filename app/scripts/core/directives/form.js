angular
  .module('theme.core.directives', [])
  .directive('autosize', function() {
    'use strict';
    return {
      restrict: 'AC',
      link: function(scope, element) {
        element.autosize({
          append: '\n'
        });
      }
    };
  })
  .directive('creditCard', ['$timeout', function($t) {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        options: '=creditCard'
      },
      link: function(scope, element) {
        $t( function () {
          angular.element(element[0]).card({
            container: scope.options.container
          });
        }, 1);
      }
    };
  }])
  .directive('fullscreen', function() {
    'use strict';
    return {
      restrict: 'AC',
      link: function(scope, element) {
        element.fseditor({
          maxHeight: 500
        });
      }
    };
  })
  .directive('colorpicker', function() {
    'use strict';
    return {
      restrict: 'AC',
      link: function(scope, element) {
        element.colorpicker();
      }
    };
  })
  .directive('daterangepicker', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        options: '=daterangepicker',
        start: '=dateBegin',
        end: '=dateEnd'
      },
      link: function(scope, element) {
        element.daterangepicker(scope.options, function(start, end) {
          if (scope.start) {
            scope.start = start.format('MMMM D, YYYY');
          }
          if (scope.end) {
            scope.end = end.format('MMMM D, YYYY');
          }
          scope.$apply();
        });
      }
    };
  })
  .directive('wizard', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        options: '=wizard'
      },
      link: function(scope, element) {
        if (scope.options) {
          element.stepy(scope.options);

          //Make Validation Compability - see docs
          if (scope.options.validate === true) {
            element.validate({
              errorClass: 'help-block',
              validClass: 'help-block',
              highlight: function(element) {
                angular.element(element).closest('.form-group').addClass('has-error');
              },
              unhighlight: function(element) {
                angular.element(element).closest('.form-group').removeClass('has-error');
              }
            });
          }
        } else {
          element.stepy();
        }
        //Add Wizard Compability - see docs
        element.find('.stepy-navigator').wrapInner('<div class="pull-right"></div>');
      }
    };
  })
  .directive('inputmask', function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.inputmask();
      }
    };
  })
  .directive('croppable', ['$timeout', function($t) {
    'use strict';
    return {
      restrict: 'A',
      replace: true,
      scope: {
        src: '@',
        imgSelected: '&',
        cropInit: '&'
      },
      link: function(scope, element) {
        var myImg;
        $t(function() {
          if (scope.src) {
            myImg = element;
            element.width(element.width()); // stupid width bug
            angular.element(myImg).Jcrop({
              trackDocument: true,
              onSelect: function(x) {
                $t(function() {
                  scope.imgSelected({
                    coords: x
                  });
                });
              },
              // aspectRatio: 1
            }, function() {
              // Use the API to get the real image size 
              scope.bounds = this.getBounds();
            });
          }
        });
        scope.$watch('bounds', function() {
          scope.cropInit({
            bounds: scope.bounds
          });
        });
      }
    };
  }]);