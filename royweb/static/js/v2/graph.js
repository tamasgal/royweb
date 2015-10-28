(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('GraphCtrl', function ($scope, $interval, tools, settings) {
        $scope.datapoints = [];
        $scope.datacolumns = [{"id":"bar","type":"line"}];
        $scope.datax = {"id": "time", "name": "NARF"}
        $scope.guid = tools.random_guid();
        $scope.width = 400;
        $scope.show_point = true;


        $scope.timeFormat = function(timestamp) {
            return d3.time.format("%X")(new Date(timestamp));
        };

        $scope.is_selected = function() {
            return settings.selected_graph === $scope.guid;
        };

        $scope.selectGraph = function() {
            console.log("Select graph: " + $scope.guid);
            settings.selected_graph = $scope.guid;
        };

        $scope.init = function() {
            console.log("Initialised graph with ID " + $scope.guid);
            settings.graphs[$scope.guid] = {};
            settings.graphs[$scope.guid].show_point = $scope.show_point;
            settings.graphs[$scope.guid].width = $scope.width;
        };
        $scope.init();

        var update_settings = function () {
            console.log("Updating settings_update!");
            $scope.show_point = settings.graphs[$scope.guid].show_point;
            $scope.width = settings.graphs[$scope.guid].width;
            console.log($scope.show_point);
        };

        settings.subscribe($scope, $scope.guid + '-settings-updated', function (event) {
            console.log("Recieved settings_update!");
            update_settings();
        });

        $interval(function(){
            var data = window.db['bar'];
            if(data) {
                $scope.datapoints = data.slice(Math.max(data.length - 35, 1));
            };
        }, 500);
    });
}());
