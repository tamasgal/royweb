(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.factory('settings', function(){
        var factory = {};

        var state = 'OFF';

        factory.state = state;

        return factory;
    });
}());

