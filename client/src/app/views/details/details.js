(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details', {
                abstract: true,
                url: '/details/:typ/:name',
                views: {
                    "header": {
                        controller: 'HeaderController',
                        templateUrl: 'views/header/header.tpl.html'
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
                    referenceData: function(Restangular) {
                        return Restangular.one('references').get();
                    },                
                    detailsData: function(Restangular, $stateParams) {
                        return Restangular.one('drugs').customGET('details',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    eventsData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('',{'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':5,'skip':0});
                    },
                    recallsData: function(Restangular, $stateParams) {
                        return Restangular.one('recalls').customGET('',{'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':5,'skip':0});
                    }
                }
            })
            ;
        })
        .controller( 'DetailsController', DetailsController);

        function DetailsController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData, referenceData) {
            $scope.references = referenceData.response;
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.events = eventsData;
            $scope.recalls = recallsData;

            $scope.totalEvents = $scope.events.response.count;
            $scope.totalRecalls = $scope.recalls.response.count;

        }
})();

