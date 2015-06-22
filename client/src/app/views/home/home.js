(function(){
    'use strict';

    angular.module('app')

        // Configuration section for the home page
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

        // Home controller
        function HomeController($scope, Restangular, $state) {

            $scope.search = function () {
                $state.go('details', {detailId: $scope.query.id});
            };

            // Function to get suggestions from the users search 
            $scope.getSuggestions = function(val) {
                return Restangular.one('drugs').customGET('suggestions',{'q':val})
                .then(function(data) {
                    if(data.result.length) {
                        return data.result.map(function(item){
                            return item;
                        });
                    }
                    else {
                        return [{"name":"No results found."}];
                    }

                }, function() {
                    
                });
            };            
        }
})();

