(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('GraphCtrl', function ($scope, $interval, tools, settings) {
        $scope.datapoints = [];
        $scope.datacolumns = [{"id":"bar","type":"line"}];
        $scope.datax = {"id": "time", "name": "NARF"}
        $scope.bindto = tools.random_guid();

        $scope.timeFormat = function(timestamp) {
            return d3.time.format("%X")(new Date(timestamp));
        };

        $scope.changeState = function() {
            settings.state = "narf";
        };

        $interval(function(){
            var data = window.db['bar'];
            if(data) {
                $scope.datapoints = data.slice(Math.max(data.length - 35, 1));
            };
        }, 1000);
    });
}());
