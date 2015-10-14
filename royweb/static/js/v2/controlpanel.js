(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.controller('ControlPanelController',
            ['$scope', 'settings', function($scope, settings) {

        //$scope.state = settings.state;
        settings.subscribe($scope, function settingsChanged() {
            $scope.state = settings.state;
        });
    }]);
}());
