(function () {
    'use strict';
    var module = angular.module('ROyWeb');

    module.factory('settings', function($rootScope){
        var factory = {};

        var state = 'OFF';
        factory.state = state;
        factory.selected_graph = false;
        factory.show_point = false;

        factory.subscribe = function(scope, event, callback) {
            var handler = $rootScope.$on(event, callback);
            scope.$on('$destroy', handler);
        };

        factory.notify = function(event) {
            console.log("Emmiting " + event);
            $rootScope.$emit(event);
        };

        return factory;
    });

    // Emit signal when something in settings has changed
    module.run(function($rootScope, settings){
        $rootScope.settings = settings;
        $rootScope.$watch('settings.selected_graph', function(){
            console.log("Settings changed");
            settings.notify('selected-graph-event');
        }, true);
    });
}());

