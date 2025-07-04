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
      ThemeClass: $window.localStorage['theme.settings.ThemeClass'] || getSystemTheme(),
    };

    var themes = {
      light: {
        '--nav-color': '#64b5f6',
        '--background-color': '#ffffff',
        '--background': '#ffffff',
        '--text-color': '#000000',
        '--border-color': '#e5e5e5',
        '--form-color': '#fafafa',
        '--important': '',
        // btn color
        '--primary':        '#03a9f4',
        '--primary-border': '#027fb8',
        '--primary-active': '#0286c2',
        '--success':        '#8bc34a',
        '--success-border': '#8bc34a',
        '--success-active': '#71a436',
        '--info':           '#00bcd4',
        '--info-border':    '#00bcd4',
        '--info-active':    '#008fa1',
        '--warning':        '#ffc107',
        '--warning-border': '#c99700',
        '--warning-active': '#d39e00',
        '--danger':         '#e51c23',
        '--danger-border':  '#b0141a',
        '--danger-active':  '#b9151b',
      },
      dark: {
        '--nav-color':      '#151f2c',
        '--background-color': '#212121',
        '--background':     '#212121',
        '--text-color':     '#dce1e7',
        '--border-color':   '#000000',
        '--form-color':     '#151f2c',
        '--important':      '!important',
       // btn color
        '--primary':        '#034b6c',
        '--primary-border': '#0c374b',
        '--primary-active': '#03374f',
        '--success':        '#33471c',
        '--success-border': '#415828',
        '--success-active': '#3a492a',
        '--info':           '#004f5a',
        '--info-border':    '#046e7c',
        '--info-active':    '#058495',
        '--warning':        '#886808',
        '--warning-border': '#3b2d01',
        '--warning-active': '#4f3b00',
        '--danger':         '#6c1114',
        '--danger-border':  '#4a0e10',
        '--danger-active':  '#51090b',
      },
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
    function getSystemTheme() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    this.applyTheme = function(themeName) {
      var theme = themes[themeName] || themes.light;
      Object.keys(theme).forEach(function(key) {
        $document[0].documentElement.style.setProperty(key, theme[key]);
      });
      
      this.settings.ThemeClass = themeName;
      $window.localStorage['theme.settings.ThemeClass'] = themeName;
      
      var topNavClass = themeName === 'dark' ? 'navbar-black' : 'navbar-blue';
      var sidebarClass = themeName === 'dark' ? 'sidebar-black' : 'sidebar-bluegray';

      $window.localStorage['theme.settings.topNavThemeClass'] = topNavClass;
      $window.localStorage['theme.settings.sidebarThemeClass'] = sidebarClass;
      
      var topNav = $document[0].querySelector('.navbar');
      var sidebar = $document[0].querySelector('.static-sidebar-wrapper');

      if (topNav) {
        topNav.classList.remove('navbar-black', 'navbar-blue');
        topNav.classList.add(topNavClass);
      }

      if (sidebar) {
        sidebar.classList.remove('sidebar-black', 'sidebar-bluegray');
        sidebar.classList.add(sidebarClass);
      }

      $document[0].body.classList.remove('light', 'dark');
      $document[0].body.classList.add(themeName);
    };
    this.change_Theme = function() {
      var newTheme = this.settings.ThemeClass === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
      $rootScope.$broadcast('themeEvent:themeChanged', newTheme);
    };

    this.initTheme = function() {
      var savedTheme = $window.localStorage['theme.settings.ThemeClass'] || getSystemTheme();
      this.applyTheme(savedTheme);

      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          var newSystemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(newSystemTheme);
          $rootScope.$apply();
        });
      }
    };
  }]);