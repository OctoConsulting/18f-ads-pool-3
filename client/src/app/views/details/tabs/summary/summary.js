(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details.summary', {
                url: '',
                views: {
                    "" : {
                        controller: 'DetailsSummaryController',
                        templateUrl: 'views/details/tabs/summary/summary.tpl.html'
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
                    },
                    ageCountData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('countByAge',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    genderCountData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('countByGender',{'q':$stateParams.name,'typ':$stateParams.typ});
                    }
                }
            })
            ;
        })
        .controller( 'DetailsSummaryController', DetailsSummaryController);

        function DetailsSummaryController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData, referenceData, eventReactionChartData, eventOutcomesChartData, recallCountData, eventCountData, ageCountData, genderCountData) {
            $scope.references = referenceData.response;
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.events = eventsData;
            $scope.events.filters = {};
            $scope.charts = {};
            $scope.charts.events = {};
            $scope.charts.events.colors1 = ['#1E6982','#4D7E96','#5397AD','#89C6D4','#B2C6D4','#214a58'];
            $scope.charts.events.colors2 = ['#4c6f28','#5c872f','#6ca037','#7cb83e','#8cc551','#9cce69'];
            $scope.maxPerPage = 5;


            $scope.charts.events.reactions = eventReactionChartData.result;
            $scope.charts.events.reactions.totalCount = eventReactionChartData.meta.totalCount;
            $scope.charts.events.outcomes = eventOutcomesChartData.results;
            $scope.charts.events.eventCount = eventCountData.results;
            $scope.charts.events.recallCount = recallCountData.results;
            $scope.charts.events.ageCount = ageCountData.results;
            $scope.charts.events.genderCount = genderCountData.results;


            $scope.events.currentPage = 1;
            $scope.events.maxPages = 5;
            $scope.events.totalPages = Math.ceil($scope.events.response.count / $scope.maxPerPage);             

            if($scope.events.totalPages > 1000) {
                $scope.events.totalPages = 1000;
            }


            /* Settings for highcharts */

            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                }
            });           


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
                    $scope.charts.events.reactions.totalCount = data.meta.totalCount;            
                }, function() {
                });

                Restangular.one('events').customGET('reactionOutComes',query)
                .then(function(data) {
                    $scope.charts.events.outcomes = data.results;                 
                }, function() {
                });

                Restangular.one('recalls').customGET('countByDate',query)
                .then(function(data) {
                    $scope.charts.events.recallCount = data.results;                 
                }, function() {
                });

                Restangular.one('events').customGET('countByDate',query)
                .then(function(data) {
                    $scope.charts.events.eventCount = data.results;                 
                }, function() {
                });

                Restangular.one('events').customGET('countByAge',query)
                .then(function(data) {
                    $scope.charts.events.ageCount = data.results;                 
                }, function() {
                });

                Restangular.one('events').customGET('countByGender',query)
                .then(function(data) {
                    $scope.charts.events.genderCount = data.results;                 
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

            if($scope.charts.events.reactions) {
                $scope.reactionsChart = {
                    options: {
                        chart: {
                            type: 'pie'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                colors: $scope.charts.events.colors1,
                                dataLabels: {
                                    enabled: false,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        tooltip: {
                            pointFormatter: function () {
                                return '<span style="color:'+this.color+'">\u25CF</span> '+this.series.name+': <b>'+Highcharts.numberFormat(this.y)+'<)/b> ('+Math.round(this.y/$scope.charts.events.reactions.totalCount*100,2) + '%'+')<br/>.';
                            }
                        }               
                    },
                    series: [{
                        name: 'Reactions',
                        data: $scope.charts.events.reactions.map(function(item){
                            return {'name':item.label, 'y':item.value};
                        })
                    }],
                    title: {
                        text: 'Adverse Event Reactions'
                    },
                    loading: false
                };
            }

            if($scope.charts.events.outcomes) {
                $scope.outcomesChart = {
                    options: {
                        chart: {
                            type: 'pie'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                colors: $scope.charts.events.colors2,
                                dataLabels: {
                                    enabled: false,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        tooltip: {
                            pointFormatter: function () {
                                return '<span style="color:'+this.color+'">\u25CF</span> '+this.series.name+': <b>'+Highcharts.numberFormat(this.y)+'</b> ('+Math.round(this.y/$scope.events.response.count*100,2) + '%'+')<br/>.';
                            }
                        }                                 
                    },               
                    series: [{
                        name: 'Outcomes',
                        data: $scope.charts.events.outcomes.map(function(item){
                            return {'name':item.label, 'y':item.value};
                        })
                    }],
                    title: {
                        text: 'Event Outcomes'
                    },
                    loading: false
                };
            }

            if($scope.charts.events.genderCount) {
                $scope.genderChart = {
                    options: {
                        chart: {
                            type: 'column'
                        },
                        plotOptions: {
                            column: {
                                showInLegend: false,
                                colorByPoint:true
                            }
                        },
                        colors: ['#293655','#89C5D3','#B1C5D3']
                    },
                    yAxis: {
                        title: {
                            text: "Events"
                        }
                    },                    
                    xAxis: {
                        categories: $scope.charts.events.genderCount.map(function(item){
                            return item.label;
                        }),
                        title: {
                            text: "Patient Gender"
                        }
                    },                
                    series: [{
                        name: 'Adverse Events',
                        data: $scope.charts.events.genderCount.map(function(item){
                            return item.value;
                        })
                    }],
                    title: {
                        text: 'Adverse Events By Gender'
                    },

                    loading: false
                };                
            }

            if($scope.charts.events.ageCount) {
                $scope.ageChart = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        plotOptions: {
                            bar: {
                                showInLegend: false,
                                colorByPoint:true
                            }
                        },
                        colors: ['#5397AC']                                              
                    },
                    yAxis: {
                        title: {
                            text: "Events"
                        }
                    },
                    xAxis: {
                        categories: $scope.charts.events.ageCount.map(function(item){
                            return item.label;
                        }),
                        title: {
                            text: "Patient Age"
                        }
                    },                
                    series: [{
                        name: 'Adverse Events',
                        data: $scope.charts.events.ageCount.map(function(item){
                            return item.value;
                        })
                    }],
                    title: {
                        text: 'Adverse Events By Age'
                    },

                    loading: false
                };
            }
            if($scope.charts.events.eventCount || $scope.charts.events.recallCount) {
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
                                color: '#293655'
                            }
                        },
                        title: {
                            text: 'Recalls',
                            style: {
                                color: '#293655'
                            }
                        },
                        min:0
                    }, { // Secondary yAxis
                        title: {
                            text: 'Adverse Events',
                            style: {
                                color: '#5397AC'
                            }
                        },
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#5397AC'
                            }
                        },
                        opposite: true,
                        min: 0
                    }],             
                    series: [{
                        name: 'Adverse Events',
                        type: 'line',
                        color: '#5397AC',
                        data: $scope.charts.events.eventCount,
                        tooltip: {
                            valueSuffix: ''
                        },
                        dataGrouping: {
                            approximation: "sum",
                            enabled: true,
                            forced: true,
                            units: [['month',[3]]]
                        }
                    }, {
                        name: 'Recalls',
                        type: 'column',
                        color: '#293655',
                        yAxis: 1,
                        data: $scope.charts.events.recallCount                  
                    }],
                    title: {
                        text: 'Adverse Events vs Recalls'
                    },
                    loading: false,
                    useHighStocks: true
                };
            }
        }
})();

