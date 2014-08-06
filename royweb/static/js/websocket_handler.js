var ws = new WebSocket("ws://" + window.royweb_ip + ":" + window.royweb_port + "/websocket");
ws.onopen = function() {
   ws.send("Hello");
};

window.limit = 100; // maximum number of kept entries for a parameter
window.graphs = [];
window.parameter_types = [];
window.parameters = new Object();

ws.onmessage = function (evt) {
    var json_obj = JSON.parse(evt.data);

    if(json_obj.kind == "parameter") {
    	process_parameter(json_obj);
    }

    if(json_obj.kind == "message") {
        log_message("Server message: " + json_obj.text);
    }    

};

function log_message(data) {
    clean_up_history(500);

    var current_date = $.datepicker.formatDate('yy-mm-dd', new Date()); 
    var current_time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    
    var line = d3.select("#console_log").append("div").attr("class", "console_line");
    line.append("span").text(current_time).attr("class", "highlighted_text");
    line.append("span").text(data);

    var objDiv = document.getElementById("console_log");

    // magic number 60 because of line wrapping, otherwise the scroll will
    // fail when browsing the history
    if(objDiv.scrollHeight - objDiv.scrollTop <= objDiv.clientHeight + 60) {
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}


function clean_up_history(lines_to_keep) {
    if($("#console_log").children().length > 500) {
        $('#console_log').find('div').first().remove();
    }
}



function process_parameter(parameter) {
    if(!includes(window.parameter_types, parameter.type)) {
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
        var graph = new Graph();
        graph.parameter_types.push(parameter.type);
        graph.set_title(parameter.type);
    }

    if(window.parameters[parameter.type].length >= window.limit) {
            window.parameters[parameter.type].shift();
    }
    window.parameters[parameter.type].push(parameter);

    update_parameter_rate(parameter);
    update_graphs(parameter);
}

function update_parameter_rate(parameter) {
    var rate = calculate_parameter_rate(parameter);
    d3.select("#" + parameter.type + "_rate").text(rate);
}

function calculate_parameter_rate(parameter) {
    var parameters = window.parameters[parameter.type];
    var latest = parameters.slice(-1)[0].time;
    var first = parameters[0].time;
    var count = parameters.length;
    parameter_rate = ((count - 1) / (latest - first) * 1000).toFixed(2);
    return parameter_rate;
}

function update_graphs(parameter) {
    for(var index in window.graphs) {
        var graph = window.graphs[index];
        if(includes(graph.parameter_types, parameter.type)) {
            graph.redraw();
        }
    }
}


