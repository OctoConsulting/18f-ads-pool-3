(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'home', {
                url: '/',
                views: {
                    "menu": {
                        templateUrl: 'views/menu/menu.tpl.html'
                    },
                    "main": {
                        controller: 'HomeController',
                        templateUrl: 'views/home/home.tpl.html'
                    },
                    "footer": {
                        templateUrl: 'views/footer/footer.tpl.html'
                    }                    
                }
            })
            ;
        })
        .controller( 'HomeController', HomeController);


        function HomeController($scope, Restangular, $state) {
            $scope.getSomething = function(){
                $scope.something = 'value';
            };
            $scope.getSuggestions = function(val) {
                return Restangular.one('drugs').customGET('suggestions',{'q':val})
                .then(function(data) {
                    $scope.names = data.result.map(function(item){
                        return item.name;
                    });
                    return $scope.names;
                }, function() {
                    
                });
            };            
        }
})();

