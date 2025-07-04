angular
  .module('theme', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'theme.core.signupPage',
    'theme.core.templates',
    'theme.core.template_overrides',
    'theme.core.directives',
    'theme.core.main_controller',
    'theme.core.navigation_controller',
    'theme.core.messages_controller',
    'theme.core.notifications_controller',
  ])
  .constant('nanoScrollerDefaults', {
    nanoClass: 'scroll-pane',
    paneClass: 'scroll-track',
    sliderClass: 'scroll-thumb',
    contentClass: 'scroll-content'
  })
  .run(['$window', '$theme', function ($window, $theme) {
    $window.ngGrid.config = {
        footerRowHeight: 40,
        headerRowHeight: 40,
        rowHeight: 40
    };
    $theme.initTheme(); 
  }]);

