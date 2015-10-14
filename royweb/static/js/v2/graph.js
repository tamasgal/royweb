(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('GraphCtrl', function ($scope, $interval, tools, settings) {
        $scope.datapoints = [];
        $scope.datacolumns = [{"id":"bar","type":"line"}];
        $scope.datax = {"id": "time", "name": "NARF"}
        $scope.guid = tools.random_guid();
        $scope.width = 400;

        $scope.timeFormat = function(timestamp) {
            return d3.time.format("%X")(new Date(timestamp));
        };

        $scope.changeState = function() {
            settings.state = $scope.guid;
        };

        $interval(function(){
            var data = window.db['bar'];
            if(data) {
                $scope.datapoints = data.slice(Math.max(data.length - 35, 1));
            };
        }, 1000);
    });
}());
