(function () {
    'use strict';

    var module = angular.module('ROyWeb');

    module.controller('ParametersController',
            ['$scope', function($scope) {

        $scope.parameters = [];
        $scope.predicate = 'type';
        $scope.reverse = false;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

    }]);
}());

