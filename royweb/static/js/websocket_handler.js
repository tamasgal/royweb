var ws = new WebSocket("ws://" + window.royweb_ip + ":" + window.royweb_port + "/websocket");
ws.onopen = function() {
   ws.send("Hello");
};

window.limit = 20; // maximum number of kept entries for a parameter
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


function includes(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

function timestamp() {
    // Return unix timestamp with milliseconds accuracy.
    return +new Date()
}

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

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


function Graph() {
    // A graph, which automatically adds itself to the content-DIV
    var self = {};

    self.id = guid();

    self.parameter_types = []; // TODO: multi-graph
    self.data = window.parameters[self.parameter_types[0]]; // TODO: multi-graphs

    self.w = 450;
    self.h = 200;
    self.padding = 25;
    self.padding_left = 50;
    self.smoothness = 100; // transition time in ms

    self.div = d3.select("#content").append("div").attr("class", "graph");
    self.title_field = self.div.append("h2");
    self.svg = self.div.append("svg")
                       .attr("width", self.w)
                       .attr("height", self.h)
                       .attr("id", self.id);



    //self.xScale = d3.scale.linear().range([self.padding_left, self.w - self.padding]);
    self.xScale = d3.time.scale().range([self.padding_left, self.w - self.padding]);
    self.yScale = d3.scale.linear().range([self.h - self.padding, self.padding]);


    var formatAsPercentage = d3.format(".1%");
    var timeFormat = d3.time.format("%X");

    self.xAxis = d3.svg.axis().scale(self.xScale).orient("bottom").ticks(5)
                              .tickSize(-(self.h - 2*self.padding), 0, 0)
                              .tickPadding(5)
                              .tickFormat(timeFormat);
    self.yAxis = d3.svg.axis().scale(self.yScale).orient("left").ticks(5)
                              .tickSize(-(self.w - self.padding - self.padding_left), 0, 0);

    self.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (self.h - self.padding) + ")")
        .call(self.xAxis);
    self.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + self.padding_left + ",0)")
        .call(self.yAxis);

    self.lines = self.svg.append("g")
        .attr("class", "lines");
    self.points = self.svg.append("g")
        .attr("class", "points");

    self.line_func = d3.svg.line()
        .x(function(d) { return self.xScale(d.time); })
        //.x(function(d, i) { return self.xScale(i); })
        .y(function(d) { return self.yScale(d.value); });
    self.lines.append("svg:path").attr("class", "line");


    self.set_title = function(title) {
        // Update the H2 field of the graph.
        self.title_field.text(title);
    }

    self.resize = function(width, height) {
        // Change the width and height of the SVG container.
        self.svg.attr("width", width).attr("height", height);
    }

    self.redraw = function() {
        for(var index in self.parameter_types) {
            //console.log(index);
        }
        self.data = window.parameters[self.parameter_types[0]]; 
        self.xScale.domain([
                           d3.min(self.data, function(d) { return d.time; }),
                           d3.max(self.data, function(d) { return d.time; })
                           ]);

        self.yScale.domain([
                           d3.min(self.data, function(d) { return d.value; }),
                           d3.max(self.data, function(d) { return d.value; })
                           ]);

        self.svg.select(".x.axis")
            .transition()
            .duration(self.smoothness)
            .call(self.xAxis)
        self.svg.select(".y.axis")
            .transition()
            .duration(self.smoothness)
            .call(self.yAxis)


        //self.lines.append("svg:path").data([data]).attr("d", self.line_func);

        //self.lines.append("svg:path").attr("d", self.line_func(data));
        //var linegraph = self.lines.data(self.data, function(d) { return d.time; });

        //self.line.transition().duration(1000).attr('d', self.line_func);

        //linegraph.enter().append("path")
        //    .attr("class", "line")
        //    .attr("d", line_func);
        //linegraph.exit().remove();


        var points = self.points.selectAll("circle")
                      .data(self.data, function(d) { return d.time; })

        points.enter()
              .append("circle")
              .attr("cx", function(d) {
                  return self.xScale(d.time);
              })
              .attr("cy", function(d) {
                  return self.yScale(d.value);
              })
              .attr("r", 2)
              .attr("fill", "#268BD3");

        points.transition()
              .duration(self.smoothness)
              .attr("cx", function(d) {
                  return self.xScale(d.time);
              })
              .attr("cy", function(d) {
                  return self.yScale(d.value);
              });

        points.exit()
              .transition()
              .duration(self.smoothness)
              .remove();

        //var slide = self.data.slice(-2)[0].time - self.data.slice(-1)[0].time;
        //var time_interval =  self.data.slice(-1)[0].time - self.data[0].time;
        //var slide_px = slide / time_interval * (self.w - self.padding_left - self.padding);

        self.lines.selectAll("path")
              .data([self.data])
              //.attr("transform", "translate(" + -slide_px + ")")
              .attr("transform", "translate(0)")
              .attr("d", self.line_func)
              .transition()
              .ease("linear")
              .duration(self.smoothness)
              .attr("transform", "translate(0)");
    }

    window.graphs.push(self);
    return self;
}

function Graph_ (parameter_type) {
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
