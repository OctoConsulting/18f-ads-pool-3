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
            'stpa.morris'
        ])

        // Declare any global configurations
        .config( function initRoutes ($urlRouterProvider, $stateProvider, RestangularProvider, $provide, laddaProvider) {
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
        .run( function initApplication ($rootScope, $state) {
            $rootScope.$state = $state;
        });
})();

