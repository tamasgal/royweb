(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('ControlPanelController',
            ['$scope', 'settings', function($scope, settings) {


        $scope.load_settings = function() {
            var graph_id = $scope.selected_graph;
            console.log("Loading settings for graph ID: " + graph_id);
            var graph_settings = settings.graphs[graph_id];
            $scope.show_point = graph_settings.show_point;
            console.log($scope.show_point);
            settings.notify(graph_id + '-settings-updated');
        };

        $scope.update_settings = function () {
            var graph_id = $scope.selected_graph;
            settings.graphs[graph_id].show_point = $scope.show_point;
            console.log("Pushed settings update to service");
            settings.notify(graph_id + '-settings-updated');
        };

        settings.subscribe($scope, 'selected-graph-event', function (event) {
            $scope.selected_graph = settings.selected_graph;
            if($scope.selected_graph) {
                $scope.load_settings();
            }
        });
    }]);
}());
