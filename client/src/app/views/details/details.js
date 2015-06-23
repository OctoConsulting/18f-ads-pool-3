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
                    }
                }
            })
            ;
        })
        .controller( 'DetailsController', DetailsController);

        function DetailsController($scope, Restangular, $state, detailsData) {
            $scope.details = detailsData;
        }
})();

