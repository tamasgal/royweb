(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('ControlPanelController',
            ['$scope', 'settings', function($scope, settings) {
        $scope.state = settings.state;
    }]);
}());
