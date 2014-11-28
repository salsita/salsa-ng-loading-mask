angular.module('salsaNgLoadingMask', [])
  .factory('SalsaLoadingMaskScope', function($rootScope) {
    var scope = $rootScope.$new();
    scope.CUSTOM_GROUP_PREFIX = 'customGroup';
    scope.DEFAULT_GROUP_NAME = 'default';

    return scope;
  })
  .factory('SalsaLoadingMaskHttpInterceptor', function($rootScope, SalsaLoadingMaskScope) {

    var getLoadingMaskGroupName = function(config) {
      if (!angular.isString(config.loadingMask)) {
        return SalsaLoadingMaskScope.DEFAULT_GROUP_NAME;
      } else {
        var alphaNumericPattern = /^[a-z0-9]+$/i;
        if (!alphaNumericPattern.test(config.loadingMask)) {
          throw new Error('Loading mask group name must contain only alphanumeric characters');
        }

        return SalsaLoadingMaskScope.CUSTOM_GROUP_PREFIX + config.loadingMask;
      }
    };

    var getMaskGroup = function(scope, groupName) {
      if (!scope[groupName]) {
        scope[groupName] = {
          hidingMaskShowed: false,
          started: 0,
          finished: 0
        };
      }

      return scope[groupName];
    };

    var responseHandler = function(response, success) {
      if (response.config.loadingMask) {
        var groupName = getLoadingMaskGroupName(response.config),
          maskGroup = getMaskGroup($rootScope, groupName);

        maskGroup.finished++;

        if (maskGroup.started === maskGroup.finished) {
          if (success) {
            SalsaLoadingMaskScope.$broadcast('salsa:hideLoadingMask:' + groupName);
          } else {
            SalsaLoadingMaskScope.$broadcast('salsa:errorHideLoadingMask:' + groupName);
          }

          maskGroup.hidingMaskShowed = false;
          maskGroup.started = 0;
          maskGroup.finished = 0;
        }
      }

      return response;
    };

    return {
      'request': function(config) {
        if (config.loadingMask) {
          var groupName = getLoadingMaskGroupName(config),
              maskGroup = getMaskGroup($rootScope, groupName);

          if (!maskGroup.hidingMaskShowed) {
            SalsaLoadingMaskScope.$broadcast('salsa:showLoadingMask:' + groupName);
          }

          maskGroup.started++;
        }

        return config;
      },
      'responseError': function(response) {
        return responseHandler(response, false);
      },
      'response': function(response) {
        return responseHandler(response, true);
      }
    }
  })
  .directive('salsaLoadingMask', function($rootScope, SalsaLoadingMaskConfig, SalsaLoadingMaskScope) {
    return {
      restrict: 'A',
      template: '<div class="salsa-mask">' + SalsaLoadingMaskConfig.template + '</div><ng-transclude></ng-transclude>',
      transclude: true,
      scope: {
        group: '@salsaLoadingMaskGroup',
        fullScreenMask: '@salsaLoadingMaskFullscreen',
        templateData: '&salsaLoadingMaskTemplateData'
      },
      link: function(scope, el) {
        var groupName = scope.group ?
            SalsaLoadingMaskScope.CUSTOM_GROUP_PREFIX + scope.group :
            SalsaLoadingMaskScope.DEFAULT_GROUP_NAME,
            maskElement = el.find('.salsa-mask');

        scope.context = scope.templateData();
        SalsaLoadingMaskScope.$on('salsa:showLoadingMask:' + groupName, function() {
          if (scope.fullScreenMask !== undefined) {
            maskElement.css('position', 'fixed');
            maskElement.css('left', 0);
            maskElement.css('top', 0);
            maskElement.css('right', 0);
            maskElement.css('bottom', 0);
            maskElement.css('z-index', 999);
          } else {
            maskElement.css('position', 'absolute');
            maskElement.css('width', el.width() + 'px');
            maskElement.css('height', el.height() + 'px');
            maskElement.css('z-index', 998);
          }

          maskElement.removeClass('error');
          maskElement.addClass('shown');
        });
        SalsaLoadingMaskScope.$on('salsa:hideLoadingMask:' + groupName, function() {
          maskElement.removeClass('shown');
        });
        SalsaLoadingMaskScope.$on('salsa:errorHideLoadingMask:' + groupName, function() {
          maskElement.addClass('error');
          maskElement.removeClass('shown');
        });
      }
    }
  })
  .provider('SalsaLoadingMaskConfig', function() {
    var defaultConfig = {
      template: ''
    };

    return {
      set: function (customConfig) {
        angular.extend(defaultConfig, customConfig);
      },
      $get: function () {
        return defaultConfig;
      }
    };
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('SalsaLoadingMaskHttpInterceptor');
  });