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

            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line'
                    }
                },
                xAxis: [{
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Recalls',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Adverse Events',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                series: [{
                    name: 'Adverse Events',
                    type: 'line',
                    data: [7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9],                    
                    tooltip: {
                        valueSuffix: ''
                    }

                }, {
                    name: 'Recalls',
                    type: 'line',
                    yAxis: 1,
                    data: [49, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
                    tooltip: {
                        valueSuffix: ''
                    }
                }],
                title: {
                    text: 'Medicine Recall Data 2015'
                },
                loading: false
            };

        }
})();

