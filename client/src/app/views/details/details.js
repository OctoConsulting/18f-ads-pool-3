(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details', {
                url: '/details/:typ/:name',
                views: {
                    "menu": {
                        templateUrl: 'views/menu/menu.tpl.html'
                    },
                    "main": {
                        controller: 'DetailsController',
                        templateUrl: 'views/details/details.tpl.html'
                    },
                    "footer": {
                        templateUrl: 'views/footer/footer.tpl.html'
                    }
                },
                data:{ pageTitle: 'Octo | 18F' },
                resolve: {
                    detailsData: function(Restangular, $stateParams) {
                        return Restangular.one('drugs').customGET('details',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    eventsData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('',{'q':$stateParams.name,'typ':$stateParams.typ,'limit':5,'skip':0});
                    },
                    recallsData: function(Restangular, $stateParams) {
                        return Restangular.one('recalls').customGET('',{'q':$stateParams.name,'typ':$stateParams.typ,'limit':5,'skip':0});
                    }
                }
            })
            ;
        })
        .controller( 'DetailsController', DetailsController);

        function DetailsController($scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData) {
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.tabState = 'recalls';
            $scope.events = eventsData;
            $scope.recalls = recallsData;

        }
})();

