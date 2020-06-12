angular
  .module('theme.core.services', [])
  .factory('progressLoader', function() {
    'use strict';

    angular.element.skylo({
      flat: true
    });

    return {
      start: function() {
        angular.element.skylo('start');
      },
      set: function(position) {
        angular.element.skylo('set', position);
      },
      end: function() {
        angular.element.skylo('end');
      },
      get: function() {
        return angular.element.skylo('get');
      },
      inch: function(amount) {
        angular.element.skylo('show', function() {
          angular.element(document).skylo('inch', amount);
        });
      }
    };
  })
  .factory('EnquireService', ['$window', function($window) {
    'use strict';
    return $window.enquire;
  }])
  .factory('wijetsService', ['$window', function($window) {
    'use strict';

    $window.$.wijets.registerAction( {
        handle: "colorpicker",
        html: '<div class="dropdown"><span class="button-icon has-bg dropdown-toggle" data-toggle="dropdown"><i class="ti ti-palette"></i></span>'+
        '<ul class="panel-color-list dropdown-menu arrow" role="menu">'+
            '<li><span data-style="panel-info"></span></li>'+
            '<li><span data-style="panel-primary"></span></li>'+
            '<li><span data-style="panel-blue"></span></li>'+
            '<li><span data-style="panel-indigo"></span></li>'+
            '<li><span data-style="panel-deeppurple"></span></li>'+
            '<li><span data-style="panel-purple"></span></li>'+
            '<li><span data-style="panel-pink"></span></li>'+
            '<li><span data-style="panel-danger"></span></li>'+
            '<li><span data-style="panel-teal"></span></li>'+
            '<li><span data-style="panel-green"></span></li>'+
            '<li><span data-style="panel-success"></span></li>'+
            '<li><span data-style="panel-lime"></span></li>'+
            '<li><span data-style="panel-yellow"></span></li>'+
            '<li><span data-style="panel-warning"></span></li>'+
            '<li><span data-style="panel-orange"></span></li>'+
            '<li><span data-style="panel-deeporange"></span></li>'+
            '<li><span data-style="panel-midnightblue"></span></li>'+
            '<li><span data-style="panel-bluegray"></span></li>'+
            '<li><span data-style="panel-bluegraylight"></span></li>'+
            '<li><span data-style="panel-black"></span></li>'+
            '<li><span data-style="panel-gray"></span></li>'+
            '<li><span data-style="panel-default"></span></li>'+
            '<li><span data-style="panel-white"></span></li>'+
            '<li><span data-style="panel-brown"></span></li>'+
        '</ul></div>',
        onClick: function () {
        },
        onInit: function () {
            var headerStyle = $(this).getWidgetState('headerStyle');
            if (headerStyle) {
                var widget = $(this).closest('[data-widget]');
                widget.removeClass('panel-info panel-primary panel-blue panel-indigo panel-deeppurple panel-purple panel-pink panel-danger panel-teal panel-green panel-success panel-lime panel-yellow panel-warning panel-orange panel-deeporange panel-midnightblue panel-bluegray panel-bluegraylight panel-black panel-gray panel-default panel-white panel-brown')
                    .addClass(headerStyle);
            }
            var button = $(this);
            $(this).find('.dropdown-menu').bind('click', function (e) {
                e.stopPropagation();
            });
            $(this).find('li span').bind('click', function (e) {
                var widget = button.closest('[data-widget]');
                widget.removeClass('panel-info panel-primary panel-blue panel-indigo panel-deeppurple panel-purple panel-pink panel-danger panel-teal panel-green panel-success panel-lime panel-yellow panel-warning panel-orange panel-deeporange panel-midnightblue panel-bluegray panel-bluegraylight panel-black panel-gray panel-default panel-white panel-brown')
                    .addClass($(this).attr('data-style'));
                $(button).setWidgetState('headerStyle', $(this).attr('data-style'));
                e.stopPropagation();
            });
        }
    });

    $window.$.wijets.registerAction( {
      handle: "refresh-demo",
      html: '<span class="button-icon"><i class="ti ti-reload"></i></span>',
      onClick: function () {
        var params = $(this).data('actionParameters');
        var widget = $(this).closest('[data-widget]');
        widget.append('<div class="panel-loading"><div class="panel-loader-' + params.type + '"></div></div>');
        setTimeout( function () {
          widget.find('.panel-loading').remove();
        }, 2000);
      }
    });

    return $window.$.wijets;
  }])
  .factory('pinesNotifications', ['$window', function ($window) {
    'use strict';
    return {
      notify: function (args) {
        args.styling = 'fontawesome';
        args.mouse_reset = false;
        var notification = new $window.PNotify(args);
        notification.notify = notification.update;
        return notification;
      },
    };
  }])
  .factory('$bootbox', ['$modal', '$window', function($modal, $window) {
    'use strict';
    // NOTE: this is a workaround to make BootboxJS somewhat compatible with
    // Angular UI Bootstrap in the absence of regular bootstrap.js
    if (angular.element.fn.modal === undefined) {
      angular.element.fn.modal = function(directive) {
        var that = this;
        if (directive === 'hide') {
          if (this.data('bs.modal')) {
            this.data('bs.modal').close();
            angular.element(that).remove();
          }
          return;
        } else if (directive === 'show') {
          return;
        }

        var modalInstance = $modal.open({
          template: angular.element(this).find('.modal-content').html()
        });
        this.data('bs.modal', modalInstance);
        setTimeout(function() {
          angular.element('.modal.ng-isolate-scope').remove();
          angular.element(that).css({
            opacity: 1,
            display: 'block'
          }).addClass('in');
        }, 100);
      };
    }

    return $window.bootbox;
  }])
  .service('lazyLoad', ['$q', '$timeout', function($q, $t) {
    'use strict';
    var deferred = $q.defer();
    var promise = deferred.promise;
    this.load = function(files) {
      angular.forEach(files, function(file) {
        if (file.indexOf('.js') > -1) { // script
          (function(d, script) {
            var fDeferred = $q.defer();
            script = d.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function() {
              $t(function() {
                fDeferred.resolve();
              });
            };
            script.onerror = function() {
              $t(function() {
                fDeferred.reject();
              });
            };

            promise = promise.then(function() {
              script.src = file;
              d.getElementsByTagName('head')[0].appendChild(script);
              return fDeferred.promise;
            });
          }(document));
        }
      });

      deferred.resolve();

      return promise;
    };
  }])
  .filter('safe_html', ['$sce', function($sce) {
    'use strict';
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  }]);