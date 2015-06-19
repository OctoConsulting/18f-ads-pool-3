(function(){
    'use strict';
    
    angular
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

        .config( function initRoutes ($urlRouterProvider, $stateProvider, RestangularProvider, $provide, laddaProvider) {
            $urlRouterProvider.otherwise( '/' );
             RestangularProvider.setBaseUrl(location.protocol + '//' + location.hostname + (location.port && ':' + location.port) + location.pathname);
            $provide.decorator('$uiViewScroll', function ($delegate, $stateParams, $location, $document) {
                return function (uiViewElement) {
                    $document.scrollTop(0, 0);
                };
            });
            laddaProvider.setOption({ 
              style: 'zoom-in'
            });            
        })

        .controller( 'AppController', function AppController ($scope, $state, $location,  appName, appVersion) {
            $scope.appName = appName;
            $scope.appVersion = appVersion;
        })
        .constant('appName', 'Octo | 18F')
        .constant('appVersion', '1.0.0')
        .run( function initApplication ($rootScope, $state) {
                $rootScope.$state = $state;

        });
})();

