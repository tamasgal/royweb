window.limit = 1000; // maximum number of parameters to cache
window.time_limit = 100; // maximum seconds to cache parameters
window.graphs = [];
window.parameter_types = [];
window.parameters = new Object();

var ws = new WebSocket("ws://" + window.royweb_ip + ":" + window.royweb_port + "/websocket");


ws.onopen = function () {
    'use strict';
    ws.send("Hello");
};


ws.onmessage = function (evt) {
    'use strict';
    var json_obj = JSON.parse(evt.data);

    if (json_obj.kind === "parameter") {
        process_parameter(json_obj);
    }

    if (json_obj.kind === "message") {
        log_message("Server message: " + json_obj.text);
    }
};


function log_message (data) {
    'use strict';
    clean_up_history(500);

    var current_date = $.datepicker.formatDate('yy-mm-dd', new Date()),
        current_time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"),
        line = d3.select("#console_log").append("div").attr("class", "console_line"),
        objDiv = document.getElementById("console_log");

    line.append("span").text(current_time).attr("class", "highlighted_text");
    line.append("span").text(data);


    // magic number 60 because of line wrapping, otherwise the scroll will
    // fail when browsing the history
    if (objDiv.scrollHeight - objDiv.scrollTop <= objDiv.clientHeight + 60) {
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}


function clean_up_history (lines_to_keep) {
    'use strict';
    if ($("#console_log").children().length > 500) {
        $('#console_log').find('div').first().remove();
    }
}


function process_parameter (parameter) {
    'use strict';
    if (!parameter_is_registered(parameter)) {
        register_new_parameter(parameter);
    }

    clean_up_parameter_cache(parameter);
    record_parameter(parameter);
    update_parameter_rate(parameter);
    update_graphs(parameter);
}


function register_new_parameter (parameter) {
    log_message("New parameter type received: " + parameter.type);
    window.parameter_types.push(parameter.type);
    var table_row = d3.select("#parameters").append("tr");
    table_row.append("td")
        .append("input")
        .attr("type", "submit")
        .attr("value", parameter.type)
        .attr("class", "parameter_type")
        .text(parameter.type);
    table_row.append("td")
        .attr("class", "parameter_rate")
        .attr("id", parameter.type + "_rate")
        .text("0");
    window.parameters[parameter.type] = [];
    var graph = new TimePlot();
    graph.register_parameter_type(parameter.type);
    graph.set_title(parameter.type);
    window.graphs.forEach(function(graph){
        graph.refresh_parameter_list();
    });
}


function parameter_is_registered (parameter) {
    return roy.tools.includes(window.parameter_types, parameter.type);
}


function record_parameter (parameter) {
    window.parameters[parameter.type].push(parameter);
}


function clean_up_parameter_cache (parameter) {
    if (window.parameters[parameter.type].length >= window.limit) {
        window.parameters[parameter.type].shift();
    }
}


function update_parameter_rate (parameter) {
    var rate = calculate_parameter_rate(parameter);
    d3.select("#" + parameter.type + "_rate").text(rate);
}


function calculate_parameter_rate (parameter) {
    var parameters = window.parameters[parameter.type],
        latest = parameters.slice(-1)[0].time,
        first = parameters[0].time,
        count = parameters.length;
    parameter_rate = ((count - 1) / (latest - first) * 1000).toFixed(2);
    return parameter_rate;
}


function update_graphs (parameter) {
    //for (var index in window.graphs) {
    //    var graph = window.graphs[index];
    //    if (roy.tools.includes(graph.parameter_types, parameter.type)) {
    //        graph.redraw();
    //    }
    //}
    window.graphs.forEach(function(graph) {
        if (roy.tools.includes(graph.parameter_types, parameter.type)) {
            graph.redraw();
        }
    });
}
