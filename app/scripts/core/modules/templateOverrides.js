angular.module('theme.core.template_overrides', [])
  .config(['$provide', function($provide) {
    'use strict';
    $provide.decorator('tabsetDirective', function($delegate) {
      $delegate[0].templateUrl = function(element, attr) {
        if (attr.tabPosition || attr.tabTheme) {
          if (attr.tabPosition && (attr.tabPosition === '\'bottom\'' || attr.tabPosition === 'bottom')) {
            return 'templates/themed-tabs-bottom.html';
          }
          return 'templates/themed-tabs.html';
        } else if (attr.panelTabs && attr.heading !== undefined) {
          return 'templates/panel-tabs.html';
        } else if (attr.panelTabs && attr.heading === undefined) {
          return 'templates/panel-tabs-without-heading.html';
        } else {
          return 'templates/themed-tabs.html';
        }
      };

      $delegate[0].$$isolateBindings.heading = {
        attrName: 'heading',
        mode: '@',
        optional: true
      };

      $delegate[0].$$isolateBindings.panelClass = {
        attrName: 'panelClass',
        mode: '@',
        optional: true
      };

      $delegate[0].$$isolateBindings.panelIcon = {
        attrName: 'panelIcon',
        mode: '@',
        optional: true
      };

      $delegate[0].$$isolateBindings.theme = {
        attrName: 'tabTheme',
        mode: '@',
        optional: true
      };

      $delegate[0].$$isolateBindings.position = {
        attrName: 'tabPosition',
        mode: '@',
        optional: true
      };

      $delegate[0].$$isolateBindings.draggable = {
        attrName: 'ngDrag',
        mode: '=',
        optional: true
      };

      return $delegate;
    });

    $provide.decorator('paginationDirective', function($delegate) {
      $delegate[0].templateUrl = function(element, attr) {
        if (attr.defaultTexts !== undefined) {
          return 'template/pagination/pagination_default.html';
        } else {
          return 'template/pagination/pagination.html';
        }
      };

      return $delegate;
    });

    $provide.decorator('pagerDirective', function($delegate) {
      $delegate[0].templateUrl = function(element, attr) {
        if (attr.defaultTexts !== undefined) {
          return 'template/pagination/pager_default.html';
        } else {
          return 'template/pagination/pager.html';
        }
      };

      return $delegate;
    });
  }])
  /* jshint ignore:start */
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('footerTemplate.html',
      "<div ng-show=\"showFooter\" class=\"ng-grid-footer\" ng-style=\"footerStyle()\">\r" +
      "\n" +
      "    <div class=\"col-md-4\" >\r" +
      "\n" +
      "        <div class=\"ngFooterTotalItems\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\" >\r" +
      "\n" +
      "            <span class=\"ngLabel\">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show=\"filterText.length > 0\" class=\"ngLabel\">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span>\r" +
      "\n" +
      "        </div>\r" +
      "\n" +
      "        <div class=\"ngFooterSelectedItems\" ng-show=\"multiSelect\">\r" +
      "\n" +
      "            <span class=\"ngLabel\">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>\r" +
      "\n" +
      "        </div>\r" +
      "\n" +
      "    </div>\r" +
      "\n" +
      "    <div class=\"col-md-4\" ng-show=\"enablePaging\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\">\r" +
      "\n" +
      "            <label class=\"control-label ng-grid-pages center-block\">{{i18n.ngPageSizeLabel}}\r" +
      "\n" +
      "               <select class=\"form-control input-sm\" ng-model=\"pagingOptions.pageSize\" >\r" +
      "\n" +
      "                      <option ng-repeat=\"size in pagingOptions.pageSizes\">{{size}}</option>\r" +
      "\n" +
      "                </select>\r" +
      "\n" +
      "        </label>\r" +
      "\n" +
      "</div>\r" +
      "\n" +
      // "<pagination total-items=\"totalFilteredItemsLength()\" ng-model=\"pagingOptions.currentPage\"></pagination>" +
      // "\n" +
      "     <div class=\"col-md-4\">\r" +
      "\n" +
      "        <div class=\"pull-right ng-grid-pagination\">\r" +
      "\n" +
      "            <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"pageToFirst()\" ng-disabled=\"cantPageBackward()\" title=\"{{i18n.ngPagerFirstTitle}}\"><i class=\"fa fa-angle-double-left\"></i></button>\r" +
      "\n" +
      "            <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"pageBackward()\" ng-disabled=\"cantPageBackward()\" title=\"{{i18n.ngPagerPrevTitle}}\"><i class=\"fa fa-angle-left\"></i></button>\r" +
      "\n" +
      "            <label class=\"control-label\">\r" +
      "\n" +
      "                   <input class=\"form-control input-sm\" min=\"1\" max=\"{{currentMaxPages}}\" type=\"number\" style=\"width:50px; height: 24px; margin-top: 1px; padding: 0 4px;\" ng-model=\"pagingOptions.currentPage\"/>\r" +
      "\n" +
      "            </label>\r" +
      "\n" +
      "            <span class=\"ngGridMaxPagesNumber\" ng-show=\"maxPages() > 0\">/ {{maxPages()}}</span>\r" +
      "\n" +
      "            <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"pageForward()\" ng-disabled=\"cantPageForward()\" title=\"{{i18n.ngPagerNextTitle}}\"><i class=\"fa fa-angle-right\"></i></button>\r" +
      "\n" +
      "            <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"pageToLast()\" ng-disabled=\"cantPageToLast()\" title=\"{{i18n.ngPagerLastTitle}}\"><i class=\"fa fa-angle-double-right\"></i></button>\r" +
      "\n" +
      "        </div>\r" +
      "\n" +
      "     </div>\r" +
      "\n" +
      "</div>\r" +
      "\n"
    );

    $templateCache.put("template/rating/rating.html",
      "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\">\n" +
      "    <i ng-repeat=\"r in range track by $index\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"fa\" ng-class=\"$index < value && (r.stateOn || 'fa-star') || (r.stateOff || 'fa-star-o')\">\n" +
      "        <span class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
      "    </i>\n" +
      "</span>");

    $templateCache.put("bootstrap/match.tpl.html", "<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><button type=\"button\" class=\"form-control ui-select-toggle\" tabindex=\"-1\" ;=\"\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> <i class=\"caret caret-right\" ng-click=\"$select.toggle($event)\"></i></button> <button type=\"button\" class=\"ui-select-clear\" ng-if=\"$select.allowClear && !$select.isEmpty()\" ng-click=\"$select.select(undefined)\"><i class=\"fa fa-times\"></i></button></div>");

    $templateCache.put("template/modal/backdrop.html",
      "<div class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
      "     ng-class=\"{in: animate}\"\n" +
      "     ng-style=\"{'z-index': 1240 + (index && 1 || 0) + index*10}\"\n" +
      "></div>\n" +
      "");
    $templateCache.put("template/modal/window.html",
      "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1250 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
      "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
      "</div>");

    $templateCache.put("template/pagination/pager_default.html",
      "<ul class=\"pager\">\n" +
      "  <li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href ng-click=\"selectPage(page - 1)\"><i class=\"fa fa-angle-left\"></i></a></li>\n" +
      "  <li ng-class=\"{disabled: noNext(), next: align}\"><a href ng-click=\"selectPage(page + 1)\"><i class=\"fa fa-angle-right\"></i></a></li>\n" +
      "</ul>");

    $templateCache.put("template/pagination/pagination_default.html",
      "<ul class=\"pagination\">\n" +
      "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(1)\"><i class=\"fa fa-angle-double-left\"></i></a></li>\n" +
      "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(page - 1)\"><i class=\"fa fa-angle-left\"></i></a></li>\n" +
      "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\"><a href ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
      "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(page + 1)\"><i class=\"fa fa-angle-right\"></i></a></li>\n" +
      "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(totalPages)\"><i class=\"fa fa-angle-double-right\"></i></a></li>\n" +
      "</ul>");

    $templateCache.put("template/accordion/accordion-group.html",
      "<div class=\"panel panel-default\">\n" +
      "  <div class=\"panel-heading\">\n" +
      "    <h2 class=\"panel-title\">\n" +
      "      <a href class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
      "    </h2>\n" +
      "  </div>\n" +
      "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
      "   <div class=\"panel-body\" ng-transclude></div>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");

    $templateCache.put("template/carousel/carousel.html",
      "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\">\n" +
      "    <ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
      "        <li ng-repeat=\"slide in slides track by $index\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
      "    </ol>\n" +
      "    <div class=\"carousel-inner\" ng-transclude></div>\n" +
      "    <a class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\"><span class=\"fa fa-prev icon-prev\"></span></a>\n" +
      "    <a class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\"><span class=\"fa fa-next icon-next\"></span></a>\n" +
      "</div>\n" +
      "");

    $templateCache.put("template/datepicker/day.html",
      "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"fa fa-chevron-left\"></i></button></th>\n" +
      "      <th colspan=\"{{5 + showWeeks}}\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"fa fa-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
      "      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{label.abbr}}</small></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr ng-repeat=\"row in rows track by $index\">\n" +
      "      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
      "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
      "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary, 'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");

    $templateCache.put("template/datepicker/month.html",
      "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"fa fa-chevron-left\"></i></button></th>\n" +
      "      <th><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"fa fa-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr ng-repeat=\"row in rows track by $index\">\n" +
      "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
      "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");

    $templateCache.put("template/datepicker/year.html",
      "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"fa fa-chevron-left\"></i></button></th>\n" +
      "      <th colspan=\"3\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"fa fa-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr ng-repeat=\"row in rows track by $index\">\n" +
      "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
      "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");

  }])
  /* jshint ignore:end */
  ;