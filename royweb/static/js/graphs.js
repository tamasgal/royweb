function Graph() {
    // A graph, which automatically adds itself to the content-DIV
    // a = typeof a !== 'undefined' ? a : 42;
    var self = {};

    self.id = roy.tools.guid();

    self.time_limit = 30; // max time offset of parameter to show
    self.w = 400;
    self.h = 220;
    self.padding = 25;
    self.padding_left = 50;
    self.smoothness = 0; // transition time in ms. Not ready yet

    self.div = d3.select("#content").append("div").attr("class", "graph");
    self.title_field = self.div.append("h2");
    var parameter_selection_div = self.div.append("div")
                                          .attr("class", "parameter_selection")
        parameter_selection_div.append("h3")
                               .attr("class", "parameter_selection")
                               .text("Parameters");
    self.parameter_selection = parameter_selection_div.append("ul")
                                   .attr("class", "parameter_selection");
    self.svg = self.div.append("svg")
                       .attr("width", self.w)
                       .attr("height", self.h)
                       .attr("id", self.id);

    self.xScale = d3.time.scale().range([self.padding_left, self.w - self.padding]);
    self.yScale = d3.scale.linear().range([self.h - self.padding, self.padding]);

    var formatAsPercentage = d3.format(".1%");
    var timeFormat = d3.time.format("%X");

    self.xAxis = d3.svg.axis().scale(self.xScale).orient("bottom").ticks(5)
                              .tickSize(-(self.h - 2*self.padding), 0, 0)
                              .tickPadding(8)
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


    self.register_parameter_type = function(parameter_type) {
        // Add parameter_type to the monitored ones and setup the SVG
        if(!roy.tools.includes(self.parameter_types, parameter_type)) {
            self.parameter_types.push(parameter_type);
            self.lines.append("svg:path").attr("class", "line " + parameter_type);
        }
    }

    self.unregister_parameter_type = function(parameter_type) {
        // Delete parameter_type from the monitored ones and cleanup the SVG
        var index = self.parameter_types.indexOf(parameter_type);
        self.parameter_types.splice(index, 1);
        self.svg.selectAll("."+parameter_type).remove();
    }

    self.toggle_parameter_type = function(parameter_type) {
        if(!roy.tools.includes(self.parameter_types, parameter_type)) {
            self.register_parameter_type(parameter_type);
        } else {
            self.unregister_parameter_type(parameter_type);
        }
    }

    self.refresh_parameter_list = function() {
        // Update the parameter selection menu
        self.parameter_selection.text("");
        window.parameter_types.forEach(function(parameter_type) {
            var js = "roy.toggle_parameter_type('" + self.id + "', '" + parameter_type + "');"
            var list_entry = self.parameter_selection.append("li");
            var checkbox = list_entry.append("input")
                    .attr("type", "checkbox")
                    .attr("onclick", js);
            if(roy.tools.includes(self.parameter_types, parameter_type)) {
                checkbox.property("checked", true);
            }
            list_entry.append("span").text(parameter_type);
        });
    }



    self.fetch_data = function() {
        // Get the parameter data for the last self.time_limit seconds
        var data = [];
        self.parameter_types.forEach(function(parameter_type) {
            var parameter_data = window.parameters[parameter_type];
            var filtered_data = parameter_data.filter(function(parameter) {
                return (parameter.time > (new Date().getTime()) - self.time_limit*1000);
            });
            data = data.concat(filtered_data);
        });
        self.data = data;
    }



    self.set_title = function(title) {
        // Update the H2 field of the graph.
        self.title_field.text(title);
    }


    self.resize = function(width, height) {
        // Change the width and height of the SVG container.
        self.svg.attr("width", width).attr("height", height);
    }

    self.parameter_color = function(parameter_type) {
        // assign color according to index in global parameter_types                      
        var index = window.parameter_types.indexOf(parameter_type);
        return roy.tools.color(index);
    }

    self.draw_lines = function() {
        // Draw the lines for each parameter_type
        self.parameter_types.forEach(function(parameter_type) {
            var data = self.data.filter(function(parameter){
                return parameter.type == parameter_type;
            });
            var min_value = d3.min(self.data, function(d) { return d.value; })
            var first = {'type': parameter_type, 'value': min_value, 'time': data[0].time};
            var last = {'type': parameter_type, 'value': min_value, 'time': data.slice(-1)[0].time};
            data = [first].concat(data, last);
            self.lines.selectAll("." + parameter_type)
                  .data([data])
                  .attr("transform", "translate(0)")
                  .attr("d", self.line_func)
                  .attr("stroke", self.parameter_color(parameter_type))
                  .attr("fill", self.parameter_color(parameter_type))
                  .transition()
                  .ease("linear")
                  .duration(self.smoothness)
                  .attr("transform", "translate(0)");
        });
    };

    self.draw_points = function() {
        // Draw the points for each parameter_type
        var points = self.points.selectAll("circle")
                      .data(self.data, function(d) { return d.time; })

        points.enter()
              .append("circle")
              .attr("cx", function(d) { return self.xScale(d.time); })
              .attr("cy", function(d) { return self.yScale(d.value); })
              .attr("r", 2)
              .attr("class", function(d) { return d.type; })
              .attr("fill", function(d) { return self.parameter_color(d.type); });

        points.transition()
              .duration(self.smoothness)
              .attr("cx", function(d) { return self.xScale(d.time); })
              .attr("cy", function(d) { return self.yScale(d.value); });

        points.exit()
              .transition()
              .duration(self.smoothness)
              .remove();
    }

    self.draw_axes = function() {
        // Update scales and draw the axes
        self.xScale.domain(d3.extent(self.data, function(d) { return d.time; }));
        self.yScale.domain(d3.extent(self.data, function(d) { return d.value; }));

        self.svg.select(".x.axis")
            .transition()
            .duration(self.smoothness)
            .call(self.xAxis)
        self.svg.select(".y.axis")
            .transition()
            .duration(self.smoothness)
            .call(self.yAxis)
    }

    self.redraw = function() {
        self.fetch_data();
        self.draw_axes();
        self.draw_points();
        self.draw_lines();
    }

    window.graphs.push(self);
    self.parameter_types = [];    
    self.refresh_parameter_list();
    return self;
}

