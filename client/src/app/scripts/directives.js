(function(){
    'use strict';

    var module = angular.module("stpa.morris", []);
    module.directive('barChart', barChart);
    module.directive('stackedBarChart', stackedBarChart);
    module.directive('donutChart', donutChart);
    module.directive('lineChart', lineChart);
    module.directive('areaChart', areaChart);

    function donutChart() {
        return {
            restrict: 'A',
            scope: {
                donutData: '='
            },
            link: function(scope, elem, attrs) {
                scope.$watch('donutData', function() {
                    if (scope.donutData) {
                        if (!scope.donutInstance) {
                            var options = {
                                element: elem,
                                data: scope.donutData,
                                resize: true,
                                colors: ['#FFC363','#FF9800']
                            };
                            scope.donutInstance = new Morris.Donut(options);
                        } else {
                            scope.donutInstance.setData(scope.donutData);
                        }
                    }
                });
            }
        };
    }

    function barChart() {
        return {
            restrict: 'A',
            scope: {
                barX: '@',
                barY: '@',
                barLabels: '@',
                barData: '='
            },
            link: function(scope, elem, attrs) {
                scope.$watch('barData', function() {
                    if (scope.barData) {
                        if (!scope.barInstance) {
                            scope.barInstance = new Morris.Bar({
                                element: elem,
                                data: scope.barData,
                                xkey: scope.barX,
                                hideHover:  'always',
                                axes: false,
                                grid: false,
                                resize: true,
                                barColors: ['#FF9800','#FFC363'],
                                ykeys: JSON.parse(scope.barY),
                                labels: JSON.parse(scope.barLabels),
                                xLabelMargin: 2
                            });
                        } else {
                            scope.barInstance.setData(scope.barData);
                        }
                    }
                });
            }
        };
    }

    function stackedBarChart() {
        return {
            restrict: 'A',
            scope: {
                barX: '@',
                barY: '@',
                barLabels: '@',
                barData: '='
            },
            link: function(scope, elem, attrs) {
                scope.$watch('barData', function() {
                    if (scope.barData) {
                        if (!scope.barInstance) {
                            scope.barInstance = new Morris.Bar({
                                element: elem,
                                data: scope.barData,
                                xkey: scope.barX,
                                hideHover:  'always',
                                axes: false,
                                grid: false,
                                stacked: true,
                                resize: true,
                                barColors: ['#FF9800','#FFC363'],
                                ykeys: JSON.parse(scope.barY),
                                labels: JSON.parse(scope.barLabels),
                                xLabelMargin: 2
                            });
                        } else {
                            scope.barInstance.setData(scope.barData);
                        }
                    }
                });
            }
        };
    }
    function lineChart() {
        return {
            restrict: 'A',
            scope: {
                lineData: '=',
                lineXkey: '@',
                lineYkeys: '@',
                lineLabels: '@',
                lineColors: '@'
            },
            link: function(scope, elem, attrs) {
                var colors;
                if (scope.lineColors === void 0 || scope.lineColors === '') {
                    colors = null;
                } else {
                    colors = JSON.parse(scope.lineColors);
                }
                scope.$watch('lineData', function() {
                    if (scope.lineData) {
                        if (!scope.lineInstance) {
                            scope.lineInstance = new Morris.Line({
                                element: elem,
                                data: scope.lineData,
                                xkey: scope.lineXkey,
                                ykeys: JSON.parse(scope.lineYkeys),
                                labels: JSON.parse(scope.lineLabels),
                                lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed']
                            });
                        } else {
                            scope.lineInstance.setData(scope.lineData);
                        }
                    }
                });
            }
        };
    }

    function areaChart() {
        return {
            restrict: 'A',
            scope: {
                areaData: '=',
                areaXkey: '@',
                areaYkeys: '@',
                areaLabels: '@'
            },
            link: function(scope, elem, attrs) {
                scope.$watch('areaData', function() {
                    if (scope.areaData) {
                        if (!scope.areaInstance) {
                            scope.areaInstance = new Morris.Area({
                                element: elem,
                                data: scope.areaData,
                                xkey: scope.areaXkey,
                                ykeys: JSON.parse(scope.areaYkeys),
                                labels: JSON.parse(scope.areaLabels)                            });
                        } else {
                            scope.areaInstance.setData(scope.areaData);
                        }
                    }
                });
            }
        };
    }
})();