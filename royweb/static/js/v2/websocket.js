window.cache_limit = 1000; // maximum number of parameters to cache
window.time_limit = 60*60*24; // maximum seconds to cache parameters
window.parameter_types = [];
window.parameters = new Object();
window.graphs = [];
window.db = []

var ws = new WebSocket("ws://" + window.royweb_ip + ":"
                               + window.royweb_port + "/websocket");

ws.onmessage = function (evt) {
    'use strict';
    var json_obj = JSON.parse(evt.data);

    switch(json_obj.kind) {
        case "parameter":
            process_parameter(json_obj);
            break;
        case "message":
            console.log(json_obj.text);
            break;
        default:
            console.log("Unknown websocket message type: " + json_obj.kind);
    }
}

function process_parameter(parameter) {
    'use strict';
    if (!parameter_is_registered(parameter)) {
        register_new_parameter(parameter);
    }
    clean_up_parameter_cache(parameter);
    record_parameter(parameter);
    update_graphs(parameter);
}

function register_new_parameter (parameter) {
    var scope = angular.element(document.getElementById("parameters")).scope();
        scope.$apply(function() {
        scope.parameters.push({type:parameter.type, rate:NaN});
    });
    window.parameter_types.push(parameter.type);
    window.parameters[parameter.type] = [];
    window.db[parameter.type] = [];
}

function parameter_is_registered (parameter) {
    return (window.parameter_types.indexOf(parameter.type) != -1);
}

function record_parameter (parameter) {
    window.parameters[parameter.type].push(parameter);
    var db_entry = {};
    db_entry[parameter.type] = parameter.value;
    db_entry['time'] = parameter.time; //new Date(parameter.time);
    window.db[parameter.type].push(db_entry);
}

function clean_up_parameter_cache (parameter) {
    if (window.parameters[parameter.type].length >= window.cache_limit) {
        window.parameters[parameter.type].shift();
    }
}

// Update parameter table
window.setInterval(function(){
    var scope = angular.element(document.getElementById("parameters")).scope();
        scope.$apply(function() {
        scope.parameters.forEach(function(parameter) {
            //parameter = scope.parameters[ix];
            parameter.rate = calculate_parameter_rate(parameter.type);
            value = window.parameters[parameter.type].slice(-1)[0].value;
            if (!isNaN(value)) {
                parameter.value = parseFloat(value.toFixed(2));
            } else {
                parameter.value = '';
            }
        });
    });
}, 1000);

function calculate_parameter_rate (parameter) {
    var entries = window.parameters[parameter];
    var count = 5;
    if (entries.length < count) {
        return NaN;
    }
    var current = Date.now(),
        latest = entries.slice(-count)[0].time;
    parameter_rate = ((count - 1) / (current - latest) * 1000).toFixed(2);
    return parseFloat(parameter_rate);
}

function update_graphs (parameter) {
    window.graphs.forEach(function(graph) {
        if (graph.parameter_types.indexOf(parameter.type) != -1) {
            graph.redraw();
        }
    });
}
