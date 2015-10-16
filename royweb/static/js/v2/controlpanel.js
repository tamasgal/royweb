(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('ControlPanelController',
            ['$scope', 'settings', function($scope, settings) {

        settings.subscribe($scope, 'selected-graph-event', function (event) {
            $scope.selected_graph = settings.selected_graph;
        });
    }]);
}());
