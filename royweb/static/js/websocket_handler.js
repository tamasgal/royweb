var ws = new WebSocket("ws://" + window.royweb_ip + ":" + window.royweb_port + "/websocket");
ws.onopen = function() {
   ws.send("Hello");
};

window.limit = 20; // maximum number of kept entries for a parameter
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


function includes(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function timestamp() {
    // Return unix timestamp with milliseconds accuracy.
    return +new Date()
}

function process_parameter(parameter) {
    if(!includes(window.parameter_types, parameter.type)) {
        log_message("New parameter type received: " + parameter.type);
        window.parameter_types.push(parameter.type);
        d3.select("#parameter_types").append("div")
                .attr("id", parameter.type + "_tag")
                .attr("class", "parameter_tag")
                .attr("rel", parameter.type)
                .text(parameter.type);
        var table_row = d3.select("#parameters").append("tr");
        table_row.append("td")
            .attr("class", "parameter_name")
            .text(parameter.type);
        table_row.append("td")
            .attr("class", "parameter_rate")
            .attr("id", parameter.type + "_rate")
            .text("0");
        window.parameters[parameter.type] = [];
    }

    if(window.parameters[parameter.type].length > window.limit) {
            window.parameters[parameter.type].shift();
    }
    window.parameters[parameter.type].push(parameter);

    update_parameter_rate(parameter);
}

function update_parameter_rate(parameter) {
    var rate = calculate_parameter_rate(parameter);
    d3.select("#foo_rate").text(rate);
}

function calculate_parameter_rate(parameter) {
    return 4;
}

function Graph (parameter_type) {
    var self = {};

    self.dataset = [];
    self.limit = 17;

    self.type = parameter_type;
    self.w = 450;
    self.h = 200;
    self.padding = 30;
    self.label_padding = 3;

    self.div = d3.select("#content").append("div").attr("class", "graph");
    //$(".graph").draggable();
    self.div.append("h2").text(self.type);

    self.svg = self.div.append("svg")
                    .attr("width", self.w)
                    .attr("height", self.h)
                    .attr("id", self.type + "_graph");

    self.xScale = d3.scale.ordinal()
                    .domain(d3.range(self.dataset.length))
                    .rangeRoundBands([self.padding, self.w - self.padding], 0.05);

    self.yScale = d3.scale.linear()
                    .domain([0, d3.max(self.dataset, function(d) { return d.value; })])
                    .range([0, self.h - self.padding * 2]);

    self.yAxisScale = d3.scale.linear()
                    .domain([0, d3.max(self.dataset, function(d) { return d.value; })])
                    .range([self.h - self.padding, self.padding]);

    self.xAxis = d3.svg.axis()
                      .scale(self.xScale)
                      .orient("bottom");

    self.yAxis = d3.svg.axis()
                      .scale(self.yAxisScale)
                      .orient("left");

    self.points = self.svg.append("g")
        .attr("class", "points");

    //self.svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + (self.h - self.padding) + ")")
    //    .call(self.xAxis);

    self.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + self.padding + ",0)")
        .call(self.yAxis);


    self.labels = self.svg.append("g")
        .attr("class", "labels");

    self.redraw = function() {
        self.xScale.domain(d3.range(self.dataset.length))
        //self.xScale.domain(d3.extent(self.dataset, function(d) { return d.event_number; }));
        self.yScale.domain([0, d3.max(self.dataset, function(d) { return d.value; })])
        self.yAxisScale.domain([0, d3.max(self.dataset, function(d) { return d.value; })])

        //self.svg.select(".x.axis")
        //    .transition()
        //    .duration(500)
        //    .call(self.xAxis)

        self.svg.select(".y.axis")
            .transition()
            .duration(500)
            .call(self.yAxis)

        var bars = self.points.selectAll("rect")
                      .data(self.dataset, function(d) { return d.event_number; })
        bars.enter()
            .append("rect")
            .attr("x", function(d, i) {
                return self.w - self.padding;
            })
            .attr("y", function(d) {
                return self.h - self.yScale(d.value) - self.padding;
            })
            .attr("width", self.xScale.rangeBand())
            .attr("height", function(d) {
                return self.yScale(d.value);
            })
            .attr("fill", "#268BD3");

        bars.transition()
            .duration(500)
            .attr("x", function(d, i) {
                return self.xScale(i);
            })
            .attr("y", function(d) {
                return self.h - self.yScale(d.value) - self.padding;
            })
            .attr("width", self.xScale.rangeBand())
            .attr("height", function(d) {
                return self.yScale(d.value);
            });

        bars.exit()
            .transition()
            .duration(500)
            .attr("y", self.h - self.padding)
            .attr("height", 0)
            .remove();

        var x_labels = self.labels.selectAll("text").data(self.dataset, function(d) { return d.event_number; });
        x_labels.enter()
            .append("text")
            .text(function(d) { return "#"+d.event_number; })
            .attr('text-anchor', 'left')
            .attr("transform", 'translate(-0,' + self.h / 2 + ') rotate(-90)')
            .attr("x", - self.h / 2 + self.padding + self.label_padding )
            .attr("y", function(d, i) {
                return self.w - self.padding / 2;
            });
        x_labels.transition()
            .duration(500)
            .attr("y", function(d, i) {
                return self.xScale(i) + self.xScale.rangeBand() / 2 + 3;
            });
        x_labels.exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
    }

    self.add_obj = function (obj) {
        if(self.dataset.length > self.limit) {
            self.dataset.shift();
        }
        self.dataset.push(obj);
    }

    return self;
}
