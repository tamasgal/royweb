(function () {
    angular.module('ROyWeb', ['ngTouch', 'gridshore.c3js.chart']);

    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('MainController',
            ['$scope', 'settings', function($scope, settings) {

        $scope.reset_graph_selection = function() {
            settings.selected_graph = false;
        };
    }]);

    module.controller('ContentController',
            ['$scope', 'settings', function($scope, settings) {
    }]);
}());
