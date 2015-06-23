(function(){
    'use strict';
    
    angular

        // Inject modules used by the application
        .module( 'app', [
            'templates-app',
            'templates-common',
            'ui.router',
            'ui.bootstrap',
            'restangular',
            'angular.filter',
            'angular-chartist',
            'angular-ladda',
            'stpa.morris',
            'angular-growl',
            'highcharts-ng',
            'angularMoment'
        ])

        // Declare any global configurations
        .config( function initRoutes ($urlRouterProvider, $stateProvider, RestangularProvider, $provide, laddaProvider, growlProvider) {
            $urlRouterProvider.otherwise( '/' );
             RestangularProvider.setBaseUrl('/api');
            $provide.decorator('$uiViewScroll', function ($delegate, $stateParams, $location, $document) {
                return function (uiViewElement) {
                    $document.scrollTop(0, 0);
                };
            });
            laddaProvider.setOption({ 
              style: 'zoom-in'
            });
            growlProvider.globalPosition('top-right');
            growlProvider.globalDisableCountDown(true);
            growlProvider.globalTimeToLive({success: 5000, error: 8000, warning: 5000, info: 5000});

            $provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate, $injector) {
                return function(exception, cause) {
                    var growl = $injector.get("growl");
                    $delegate(exception, cause);
                    growl.error("There was an issue: " + exception.message);
                };
            }]);
        })

        // Initiate the application
        .controller( 'AppController', function AppController ($scope, $state, $location,  appName, appVersion) {
            $scope.appName = appName;
            $scope.appVersion = appVersion;
        })

        // Declare application name and version
        .constant('appName', 'Octo | 18F')
        .constant('appVersion', '1.0.0')

        // Main Run Function
        .run( function initApplication ($rootScope, $state, Restangular, growl) {

            $rootScope.$state = $state;

            Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
                
                if (response.status === 404 || response.status === 500) {
                    growl.error(response.data.message);
                }

                return true;
                
            });

        })
        ;
})();

