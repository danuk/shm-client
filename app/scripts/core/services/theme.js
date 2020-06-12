angular
  .module('theme.core.services')
  .service('$theme', ['$rootScope', 'EnquireService', '$document', '$window', function($rootScope, EnquireService, $document, $window) {
    'use strict';
    this.settings = {
      fixedHeader: true,
      leftbarCollapsed: false,
      leftbarShown: false,
      extraBarShown: false,
      fullscreen: false,
      layoutHorizontal: false,
      layoutHorizontalLargeIcons: false,
      layoutBoxed: false,
      topNavThemeClass: $window.localStorage['theme.settings.topNavThemeClass'] || 'navbar-blue',
      sidebarThemeClass: $window.localStorage['theme.settings.sidebarThemeClass'] || 'sidebar-bluegray',
      pageTransitionStyle: 'fadeIn',
      dropdownTransitionStyle: 'fadeIn',
      showSmallSearchBar: false,
      alternateStyle: true,
    };

    var brandColors = {
      'default':      '#fafafa',
      'gray':         '#9e9e9e',

      'inverse':      '#757575',
      'primary':      '#03a9f4',
      'success':      '#8bc34a',
      'warning':      '#ffc107',
      'danger':       '#e51c23',
      'info':         '#00bcd4',
      
      'brown':        '#795548',
      'indigo':       '#3f51b5',
      'orange':       '#ff9800',
      'midnightblue': '#37474f',
      'teal':         '#009688',
      'pink':         '#e91e63',
      'purple':       '#9c27b0',
      'green':        '#4caf50',
      'deeppurple':   '#673ab7',
      'deeporange':   '#ff5722',
      'lime':         '#cddc39'
    };

    this.getBrandColor = function(name) {
      if (brandColors[name]) {
        return brandColors[name];
      } else {
        return brandColors['default'];
      }
    };

    $document.ready(function() {
      EnquireService.register('screen and (max-width: 767px)', {
        match: function() {
          $rootScope.$broadcast('themeEvent:maxWidth767', true);
        },
        unmatch: function() {
          $rootScope.$broadcast('themeEvent:maxWidth767', false);
        }
      });
    });

    this.get = function(key) {
      return this.settings[key];
    };
    this.set = function(key, value) {
      if (key == 'topNavThemeClass' || key == 'sidebarThemeClass') {
        window.localStorage['theme.settings.'+key] = value;
      }
      this.settings[key] = value;
      $rootScope.$broadcast('themeEvent:changed', {
        key: key,
        value: this.settings[key]
      });
      $rootScope.$broadcast('themeEvent:changed:' + key, this.settings[key]);
    };
    this.values = function() {
      return this.settings;
    };
  }]);