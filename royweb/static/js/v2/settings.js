(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.factory('settings', function($rootScope){
        var factory = {};

        var state = 'OFF';
        factory.state = state;
        factory.show_point = false;

        factory.subscribe = function(scope, callback) {
            var handler = $rootScope.$on('settings-service-event', callback);
            scope.$on('$destroy', handler);
        };

        factory.notify = function() {
            $rootScope.$emit('settings-service-event');
        };

        return factory;
    });

    // Emit signal when something in settings has changed
    module.run(function($rootScope, settings){
        $rootScope.settings = settings;
        $rootScope.$watch('settings', function(){
            console.log("Settings changed");
            settings.notify();
        }, true);
    });
}());

