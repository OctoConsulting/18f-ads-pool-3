(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details', {
                url: '/details/:typ/:name',
                views: {
                    "menu": {
                        controller: 'MenuController',
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

        function DetailsController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData) {
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.tabState = 'recalls';
            $scope.events = eventsData;
            $scope.recalls = recallsData;
            
            $scope.maxPerPage = 5;

            $scope.events.currentPage = 1;
            $scope.events.maxPages = 5;
            $scope.events.totalPages = Math.ceil($scope.events.response.count / $scope.maxPerPage);

            $scope.recalls.currentPage = 1;
            $scope.recalls.maxPages = 5;
            $scope.recalls.totalPages = Math.ceil($scope.recalls.response.count / $scope.maxPerPage);

            if($scope.events.totalPages > 1000) {
                $scope.events.totalPages = 1000;
            }

            if($scope.recalls.totalPages > 1000) {
                $scope.recalls.totalPages = 1000;
            }

            $scope.eventsPageChanged = function () {
                $scope.events.pageChangeAction = 1;
                Restangular.one('events').customGET('',{'q':$stateParams.name,'typ':$stateParams.typ,'limit':$scope.maxPerPage,'skip':($scope.events.currentPage-1)*$scope.maxPerPage})
                .then(function(data) {
                    $scope.events.response = data.response;
                    $scope.events.pageChangeAction = 0;
                }, function() {
                    $scope.events.pageChangeAction = 0;
                });
            };

            $scope.recallsPageChanged = function () {
                $scope.recalls.pageChangeAction = 1;
                Restangular.one('recalls').customGET('',{'q':$stateParams.name,'typ':$stateParams.typ,'limit':$scope.maxPerPage,'skip':($scope.recalls.currentPage-1)*$scope.maxPerPage})
                .then(function(data) {
                    $scope.recalls.response = data.response;
                    $scope.recalls.pageChangeAction = 0;
                }, function() {
                    $scope.recalls.pageChangeAction = 0;
                });
            };
        }
})();

