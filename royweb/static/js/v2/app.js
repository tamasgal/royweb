(function () {
    var app = angular.module('ROyWeb', ['gridshore.c3js.chart']);

    app.controller('ParametersController',
            ['$scope', function($scope) {

        $scope.parameters = [];
        $scope.predicate = 'type';
        $scope.reverse = false;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

    }]);

    app.controller('SettingsController',
            ['$scope', function($scope) {
    }]);


    app.factory('GraphSettingsFactory', function () {
        var factory = {};

        return factory;
    });


    app.directive('donutChart', function(){
        function link(scope, el, attr){
            var color = d3.scale.category10();
            var data = scope.data;
            var width = 300;
            var height = 300;
            var min = Math.min(width, height);
            var svg = d3.select(el[0]).append('svg');
            var pie = d3.layout.pie().sort(null);
            var arc = d3.svg.arc()
                .outerRadius(min / 2 * 0.9)
                .innerRadius(min / 2 * 0.5);

            svg.attr({width: width, height: height});
            var g = svg.append('g')
                // center the donut chart
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            // add the <path>s for each arc slice
            g.selectAll('path').data(pie(data))
                .enter().append('path')
                .style('stroke', 'white')
                .attr('d', arc)
                .attr('fill', function(d, i){ return color(i) });
         }
        return {
            link: link,
            restrict: 'E',
            scope: { data: '=' }
        };
    });

    app.controller('GraphCtrl', function ($scope, $interval) {
        $scope.datapoints = [];
        $scope.datacolumns = [{"id":"bar","type":"line"}];
        $scope.datax = {"id": "time", "name": "NARF"}
        $scope.bindto = Math.random().toString(36).substring(7);

        $scope.timeFormat = function(timestamp) {
            return d3.time.format("%X")(new Date(timestamp));
        };

        $interval(function(){
            var data = window.db['bar'];
            $scope.datapoints = data.slice(Math.max(data.length - 35, 1));
        }, 1000);
    });
}());
