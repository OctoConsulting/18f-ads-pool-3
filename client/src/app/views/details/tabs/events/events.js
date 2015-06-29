(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details.events', {
                url: '/events',
                views: {
                    "" : {
                        controller: 'DetailsEventsController',
                        templateUrl: 'views/details/tabs/events/events.tpl.html'
                    }
                },
                data:{ pageTitle: 'Octo | 18F' },
                resolve: {
                    eventReactionChartData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('reactions',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    eventOutcomesChartData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('reactionOutComes',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    recallCountData: function(Restangular, $stateParams) {
                        return Restangular.one('recalls').customGET('countByDate',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    eventCountData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('countByDate',{'q':$stateParams.name,'typ':$stateParams.typ});
                    }                 
                }
            })
            ;
        })
        .controller( 'DetailsEventsController', DetailsEventsController);

        function DetailsEventsController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData, referenceData, eventReactionChartData, eventOutcomesChartData, recallCountData, eventCountData) {
            $scope.references = referenceData.response;
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.events = eventsData;
            $scope.events.filters = {};
            $scope.charts = {};
            $scope.charts.events = {};
            $scope.charts.events.reactions = eventReactionChartData.result;
            $scope.charts.events.outcomes = eventOutcomesChartData.results;
            $scope.charts.events.colors1 = ["#237479","#2D9596","#32A6AD","#5BB8BD","#70C1C6"];
            $scope.charts.events.colors2 = ["#9AB45C","#8DA84D","#819A47","#758C40","#697E3A","#5E7033"];
            $scope.maxPerPage = 5;

            $scope.eventCount = eventCountData.results;
            $scope.recallCount = recallCountData.results;

            $scope.events.currentPage = 1;
            $scope.events.maxPages = 5;
            $scope.events.totalPages = Math.ceil($scope.events.response.count / $scope.maxPerPage);             

            if($scope.events.totalPages > 1000) {
                $scope.events.totalPages = 1000;
            }

            $scope.recallsPageChanged = function () {
                $scope.recalls.pageChangeAction = 1;
                $scope.updateRecalls();
            };

            $scope.getRelevantImage = function(date) {
                var threeYearsAgo = moment().subtract(3, 'years');
                var sixYearsAgo = moment().subtract(6, 'years');
                var tenYearsAgo = moment().subtract(10, 'years');
                var assets = '/assets/images/icons/';

                if(moment(date) > threeYearsAgo) {
                    return assets+'dials_V4_alert4.png';
                }
                else if(moment(date) <= threeYearsAgo && moment(date) > sixYearsAgo) {
                    return assets+'dials_V4_alert3.png';
                }
                else if(moment(date) <= sixYearsAgo && moment(date) > tenYearsAgo) {
                    return assets+'dials_V4_alert2.png';
                }
                else {
                    return assets+'dials_V4_alert1.png';
                }                            
            };

            $scope.updateEvents = function () {

                var query = {'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':$scope.maxPerPage,'skip':($scope.events.currentPage-1)*$scope.maxPerPage};

                if($scope.events.filters.gender) {
                    query.gender = $scope.events.filters.gender.code;
                }

                if($scope.events.filters.age) {
                    if($scope.events.filters.age.minAge) {
                        query.minAge = $scope.events.filters.age.minAge;
                    }

                    if($scope.events.filters.age.maxAge) {
                        query.maxAge = $scope.events.filters.age.maxAge;
                    }
                }

                if($scope.events.filters.time) {
                    if($scope.events.filters.time.minDt) {
                        query.toDate = moment().subtract($scope.events.filters.time.minDt, 'years').format("YYYY-MM-DD");
                    }

                    if($scope.events.filters.time.maxDt) {
                        query.fromDate = moment().subtract($scope.events.filters.time.maxDt, 'years').format("YYYY-MM-DD");
                    }
                }

                if($scope.events.filters.severity) {
                    query.seriousness = $scope.events.filters.severity.code;
                }

 
                Restangular.one('events').customGET('reactions',query)
                .then(function(data) {
                    $scope.charts.events.reactions = data.result;                 
                }, function() {
                });

                Restangular.one('events').customGET('reactionOutComes',query)
                .then(function(data) {
                    $scope.charts.events.outcomes = data.results;                 
                }, function() {
                });

                return Restangular.one('events').customGET('',query)
                .then(function(data) {
                    $scope.events.response = data.response;
                    $scope.events.pageChangeAction = 0;
                }, function() {
                    $scope.events.pageChangeAction = 0;
                });
            };

            $scope.chartReactionsFormatter = function(input) {
                return Math.round(input.value/$scope.events.response.count*100,2) + '%';
            };

            $scope.chartOutcomesFormatter = function(input) {
                return Math.round(input.value/$scope.events.response.count*100,2) + '%';
            };

            $scope.updateGender = function (gender) {
                if(gender) {
                    $scope.events.filters.gender = gender;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.gender);
                }
                $scope.updateEvents();
            };

            $scope.updateAge = function (age) {
                if(age) {
                    $scope.events.filters.age = age;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.age);
                }
                $scope.updateEvents();
            };    

            $scope.updateTimeframe = function (time) {
                if(time) {
                    $scope.events.filters.time = time;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.time);
                }
                $scope.updateEvents();
            }; 

            $scope.updateSeverity = function (severity) {
                if(severity) {
                    $scope.events.filters.severity = severity;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.severity);
                }
                $scope.updateEvents();
            }; 


            $scope.chartConfig = {
                options: {
                    chart: {
                        zoomType: 'x'
                    },
                    rangeSelector: {
                        enabled: true
                    },
                    navigator: {
                        enabled: true
                    }
                },
                series: [{id:1,data: $scope.eventCount},{id:2,data: $scope.recallCount}],
                title: {
                    text: 'Hello'
                },
                useHighStocks: true
            };
            
            $scope.timeChart = {
                options: {
                    chart: {
                        zoomType: 'x'
                    },
                    rangeSelector: {
                        enabled: true
                    },
                    navigator: {
                        enabled: true
                    }
                },
                xAxis: {
                    type: 'datetime'
                },
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
                    },
                    min:0
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
                    opposite: true,
                    min: 0
                }],             
                series: [{
                    name: 'Adverse Events',
                    type: 'line',
                    //data: [[Date.UTC(2003,9,9),46],[Date.UTC(2003,10,9),31],[Date.UTC(2003,11,9),15],[Date.UTC(2004,1,9),3],[Date.UTC(2004,3,9),34],[Date.UTC(2004,11,9),85],[Date.UTC(2005,9,9),49],[Date.UTC(2006,9,9),25],[Date.UTC(2007,1,9),27],[Date.UTC(2007,4,9),26],[Date.UTC(2007,12,9),72],[Date.UTC(2008,1,9),7.6],[Date.UTC(2008,2,9),12],[Date.UTC(2008,2,19),10],[Date.UTC(2008,3,9),20],[Date.UTC(2009,1,9),3],[Date.UTC(2010,1,9),10],[Date.UTC(2011,1,9),11],[Date.UTC(2011,2,9),40],[Date.UTC(2013,5,9),22]],                    
                    data: $scope.eventCount,
                    tooltip: {
                        valueSuffix: ''
                    },
                    dataGrouping: {
                        approximation: "sum",
                        enabled: true,
                        forced: true,
                        units: [['month',[6]]]
                    }
                }, {
                    name: 'Recalls',
                    type: 'column',
                    yAxis: 1,
                    //data: [[Date.UTC(2003,9,9),1],[Date.UTC(2003,10,9),1],[Date.UTC(2007,4,9),1],[Date.UTC(2007,12,9),1],[Date.UTC(2008,1,9),1],[Date.UTC(2008,2,9),1],[Date.UTC(2008,2,19),2],[Date.UTC(2008,3,9),1],[Date.UTC(2009,1,9),1],[Date.UTC(2010,1,9),1],[Date.UTC(2011,1,9),1]],
                    data: $scope.recallCount,
                    tooltip: {
                        pointFormatter: function () {
                            return '<b>' + Highcharts.dateFormat('%b %Y', this.x) +
                                    '</b> ' + this.series.name + ': ' + this.y;
                        }
                    }                    
                }],
                title: {
                    text: 'Medicine Recall Data 2015'
                },
                loading: false,
                useHighStocks: true
            };
        }
})();

