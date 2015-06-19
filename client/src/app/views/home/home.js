(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'home', {
                url: '/',
                views: {
                    "main": {
                        controller: 'HomeController',
                        templateUrl: 'views/home/home.tpl.html'
                    }
                }
            })
            ;
        })
        .controller( 'HomeController', HomeController);


        function HomeController($scope, Restangular, $state) {
        }
})();

