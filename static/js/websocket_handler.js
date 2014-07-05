var ws = new WebSocket("ws://" + window.royweb_ip + ":" + window.royweb_port + "/websocket");
ws.onopen = function() {
   ws.send("Hello");
};

window.event_times = [];
window.parameter_types = [];
window.graphs = [];
window.current_event = 0;

ws.onmessage = function (evt) {
    var json_obj = JSON.parse(evt.data);

    if(json_obj.kind == "parameter") {
    	var event_number = json_obj.event_number;
        update_event_number(event_number);
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

function update_event_number(event_number) {
    if(event_number > window.current_event) {
    	var event_rate = calculate_event_rate();
        window.current_event = event_number;
    }
}

function calculate_event_rate() {
    if(window.event_times.length > 10) {
        window.event_times.shift();
    }
    var event_time = new Date().getTime();
    window.event_times.push(event_time);
    var latest = window.event_times.slice(-1)[0];
    var first = window.event_times[0];
    var count = window.event_times.length;
    var event_rate = ((count - 1) / (latest - first) * 1000).toFixed(2);

    d3.select("#event_rate").text(event_rate + " Hz");

    if(event_rate > 2) {
        $('#event_rate').css("color", "#FF5179");
        $('#event_rate_indicator').css("background-color", "#FF5179");
    } else {
        $('#event_rate').css("color", "#268BD3");
        $('#event_rate_indicator').css("background-color", "#268BD3");
    }
    $('#event_rate').stop(true, true).show();
    $('#event_rate_indicator')
        .stop(true, true)
        .fadeIn(50)
        .fadeOut(10, function(){
            $('#event_rate').fadeOut(5000);
        });

    return event_rate;
}

function includes(arr,obj) {
    return (arr.indexOf(obj) != -1);
}


function process_parameter(obj) {
    if(!includes(window.parameter_types, obj.type)) {
        window.parameter_types.push(obj.type);
        d3.select("#parameter_types").append("div")
                .attr("id", obj.type + "_tag")
                .attr("class", "parameter_tag")
                .attr("rel", obj.type)
                .text(obj.type);
        $("#"+obj.type + "_tag").click(function() {
            $("#" + obj.type + "_graph").parent().fadeToggle();
            $(this).toggleClass("inactive_parameter", 200);
        }); 

        var graph = new Graph(obj.type);
        window.graphs.push(graph);

        log_message("New parameter type received: " + obj.type);
    }

    for (index = 0; index < window.graphs.length; ++index) {
        graph = window.graphs[index];
        if(graph.type == obj.type) {
            graph.add_obj(obj);
            graph.redraw();
        }
    }
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
