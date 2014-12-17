function Graph() {
    // The one and only Graph. Use it only as prototype!

    this.init = function() {
        this.id = roy.tools.guid();
        this.time_limit = 180; // max time offset of parameter to show
        this.w = 480;
        this.h = 250;
        this.padding = 37;
        this.padding_left = 75;
        this.smoothness = 0; // transition time in ms. Not ready yet

        this.show_parameter_labels = true;

        this.x_min = null;
        this.x_max = null;
        this.y_min = null;
        this.y_max = null;

        this.setup_html();
        this.setup_svg();
        this.setup_labels();
        this.setup_menu();
        this.setup();

        window.graphs.push(this);
        this.parameter_types = [];
        this.set_title("untitled");
        this.refresh_parameter_list();
    };

    this.setup = function() {};

    this.set_title = function(title) {
        // update the h2 field of the graph.
        this.title_field.attr("value", title);
    };

    this.get_title = function() {
        return this.title_field[0][0].value; // why??
    };

    this.set_time_limit = function(time_limit) {
        if(time_limit > 1) {
            this.time_limit = time_limit;
            this.time_limit_input.attr("value", time_limit);
        }
    };
    this.set_x_min = function(x_min) {};
    this.set_x_max = function(x_max) {};
    this.set_y_min = function(y_min) {};
    this.set_y_max = function(y_max) {};

    this.setup_html = function() {
        this.div = d3.select("#content").append("div").attr("class", "graph");
        this.title_field = this.div.append("div")
            .append("input")
            .attr("class", "graph_title");
            //.attr("id", this.id + "-" + "title");
            //.on("blur", function() {
            //    self.set_title(this.value);
            //});
        this.menu_div = this.div.append("div").attr("class", "graph_menu");
        this.svg = this.div.append("svg")
            .attr("width", this.w)
            .attr("height", this.h)
            .attr("id", 'svg' + this.id)
            .style('font-family', 'sans-serif')
            .style('font-size', '10px');

        this.tooltip = this.div.append('div')
            .style('position', 'absolute')
            .style('background', '#000000')
            .style('padding', '3px')
            .style('color', '#ffffff')
            .style('opacity', .0);
    };

    this.update_parameter_labels = function () {
        var self = this;

        d3.select("#labels" + self.id).remove();

        if (!self.show_parameter_labels) {
            return;
        }

        var param_height = 12;
        var labels_width = 16 + 7 * self.parameter_types.longest().length;
        var labels_width = 16 + 7 * 10;
        var labels_height = param_height * self.parameter_types.length + param_height / 2;
        var labels_pos_x = self.w - labels_width - self.padding;
        var labels_pos_y = self.padding;
        var labels_field = self.svg
            .append("g")
            .attr("id", 'labels' + self.id)
            .style('font-family', 'monospace')
            .attr("transform", "translate(" + labels_pos_x + ", " + labels_pos_y + ")");
        labels_field.append("rect")
            .attr("width", labels_width)
            .attr("height", labels_height)
            .attr("fill", "white")
            .style("opacity", 0.5)
            .attr("stroke", "black")
            .attr('shape-rendering', 'crispEdges');

        var labels = labels_field.append("text");
        var count = 0;
        self.parameter_types.forEach(function(parameter_type) {
            labels_field.append("rect")
                .attr("transform", "translate(3, " + (4 + count * param_height) + ")")
                .attr("fill", self.parameter_color(parameter_type))
                .attr("width", 9)
                .attr("height", 9);
            labels.append("tspan")
                .attr("x", 16)
                .attr("dy", param_height)
                .text(parameter_type);
            count += 1;
        });
    };

    this.close = function() {
        var index = window.graphs.indexOf(this);
        if (index > -1) {
            window.graphs.splice(index, 1);
            this.div.remove();
        }
    };



    this.setup_menu = function() {
        var self = this;

        var graph_div = this.menu_div.append("div").attr("class", "menu_item");
        var js_close_graph = "roy.close_graph('" + this.id + "');";
        graph_div.append("h3").text("Graph");
        graph_div.append("div").attr("class", "menu_button").append("a").text("Close")
            .attr("onclick", js_close_graph);
        var js_export_graph = "roy.export_graph('" + this.id + "');";
        this.export_button = graph_div.append("div").attr("class", "menu_button").append("a").text("Export")
            .attr("onmouseover", js_export_graph)
            .attr("id", 'export_button' + this.id);

        var parameter_selection_div = this.menu_div.append("div")
            .attr("class", "menu_item");
        parameter_selection_div.append("h3")
            .attr("class", "parameter_selection")
            .text("Parameters");
        this.parameter_selection = parameter_selection_div.append("ul")
            .attr("class", "parameter_selection");

        var settings_div = this.menu_div.append("div")
            .attr("class", "menu_item");
        settings_div.append("h3")
            .attr("class", "graph_settings")
            .text("Settings");
        this.settings_menu = settings_div.append("div");

        this.settings_menu.append("div").append("span").text("Time limit:");
        this.time_limit_input = this.settings_menu.append("input")
            .attr("value", this.time_limit)
            .on("input", function() {
                self.set_time_limit(parseInt(this.value));
            });

        this.settings_menu.append("div").append("span").text("Width:");
        this.size_width_input = this.settings_menu.append("input")
            .attr("value", this.w)
            .on("input", function() {
                self.resize(parseInt(this.value), this.h);
            });
        this.settings_menu.append("div").append("span").text("Height:");
        this.size_width_input = this.settings_menu.append("input")
            .attr("value", this.h)
            .on("input", function() {
                self.resize(this.w, parseInt(this.value));
            });

        this.settings_menu.append("div").append("span").text("Line of attention:");
        this.line_of_attention_value_input = this.settings_menu.append("input")
            .attr("value", '')
            .on("input", function() {
                self.set_line_of_attention_value(parseFloat(this.value));
            });
    };

    this.setup_labels = function() {
        this.x_label = this.svg.append("text")
            .attr("y", this.h - 5)
            .attr("x", parseInt(this.w /2))
            .attr("dx", "1em")
            .style("text-anchor", "middle")
            .style("fill", "#647B83")
            .text("X-label");
        this.y_label = this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("x", -parseInt(this.h / 2))
            .attr("dy", "1em")
            .style("fill", "#647B83")
            .style("text-anchor", "middle");
    };


    this.fetch_data = function() {
        // Get the parameter data for the last this.time_limit seconds
        var data = [];
        var self = this;
        this.parameter_types.forEach(function(parameter_type) {
            var parameter_data = window.parameters[parameter_type];
            if (parameter_data) {
                var filtered_data = parameter_data.filter(function(parameter) {
                    return (parameter.time > (new Date().getTime()) - self.time_limit*1000);
                });
                data = data.concat(filtered_data);
            }
        });
        this.data = data;
    };

    this.parameter_setup = function() { };
    this.parameter_teardown = function() { };

    this.register_parameter_type = function(parameter_type) {
        // Add parameter_type to the monitored ones and setup the SVG
        if(!roy.tools.includes(this.parameter_types, parameter_type)) {
            this.parameter_types.push(parameter_type);
            this.parameter_setup(parameter_type);
            this.update_parameter_labels();
        }
    };

    this.unregister_parameter_type = function(parameter_type) {
        // Delete parameter_type from the monitored ones and cleanup the SVG
        var index = this.parameter_types.indexOf(parameter_type);
        this.parameter_types.splice(index, 1);
        this.svg.selectAll("."+parameter_type).remove();
        this.parameter_teardown(parameter_type);
        this.update_parameter_labels();
    };

    this.toggle_parameter_type = function(parameter_type) {
        if(!roy.tools.includes(this.parameter_types, parameter_type)) {
            this.register_parameter_type(parameter_type);
        } else {
            this.unregister_parameter_type(parameter_type);
        }
    };

    this.resize = function(width, height) {
        // Change the width and height of the graph.
        var self = this;
        self.w = width || self.w;
        self.h = height || self.h;
        if (self.w < 250) { self.w = 250; }
        if (self.h < 180) { self.h = 180; }
        self.svg.attr("width", self.w).attr("height", self.h);
        self.xScale.range([self.padding_left, self.w - self.padding]);
        self.yScale.range([self.h - self.padding, self.padding]);
        if(self.x_axis_dom) {
            self.x_axis_dom.attr("transform", "translate(0," + (self.h - self.padding) + ")");
        }
        self.x_label.attr("y", self.h - 5).attr("x", parseInt(self.w /2));
        self.y_label.attr("y", 5).attr("x", -parseInt(this.h / 2));
        if(self.xAxis) {
            self.xAxis.ticks(parseInt(self.w / 100))
                      .tickSize(-(self.h - 2*self.padding), 0, 0)
                      .tickPadding(8);
        }
        self.yAxis.ticks(parseInt(self.h / 30))
                  .tickSize(-(self.w - self.padding - self.padding_left), 0, 0);
        self.update_parameter_labels();
        self.redraw();
    };

    this.set_line_of_attention_value = function(value) {
        value = parseFloat(value)
        if(isFinite(value)) {
            this.line_of_attention_value = value;
            this.line_of_attention.attr('opacity', 1);
        } else {
            this.line_of_attention.attr('opacity', 0);
        }
    };

    this.set_line_of_attention = function(value) {
        if(value) {
            this.line_of_attention_value = value;
            this.line_of_attention_value_input.attr("value", value);
        }
    };

    this.draw_line_of_attention = function() {
        var self = this;
        var value = self.line_of_attention_value;
        if(value && typeof value === 'number' && isFinite(value)) {
            self.line_of_attention
                .style("stroke-dasharray", ("3, 3"))
                .attr("stroke", 'red')
                .attr('shape-rendering', 'crispEdges')
                .attr("x1", self.xScale.range()[0])
                .attr("y1", self.yScale(value))
                .attr("x2", self.xScale.range()[1])
                .attr("y2", self.yScale(value));
        }
    }

    this.parameter_color = function(parameter_type) {
        // assign color according to index in global parameter_types
        var index = window.parameter_types.indexOf(parameter_type);
        return roy.tools.color(index);
    };
}


function TimePlot() {
    // A simple value vs. time plot
    // a = typeof a !== 'undefined' ? a : 42;

    var self = this;
    self.type = "timeplot";

    this.setup = function() {
        self.points_enabled = false;
        self.fill_enabled = false;
        self.line_enabled = true;
        self.y_scale_type = "lin";

        this.settings_menu.append("div").append("span").text("y-axis scale:");
        this.y_scale_type_input = this.settings_menu.append("input")
            .attr("value", this.y_scale_type)
            .attr("type", "submit")
            .on("click", function() {
                self.switch_y_scale_type();
                self.set_y_scale_type(this.value);
            });

        this.settings_menu.append('div').append('span').text('y-min:');
        this.y_min_input = this.settings_menu.append('input')
            .attr('value', this.y_min)
            .on('input', function() {
                self.set_y_min(this.value);
            });
        this.settings_menu.append('div').append('span').text('y-max:');
        this.y_max_input = this.settings_menu.append('input')
            .attr('value', this.y_max)
            .on('input', function() {
                self.set_y_max(this.value);
            });

        self.x_label.text("time");
    };

    this.set_y_scale_type = function(scale_type) {
        switch (scale_type) {
            case "lin":
                this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
                this.y_scale_type = "lin";
                this.y_scale_type_input.attr("value", "lin");
                break;
            case "log":
                this.yScale = d3.scale.log().range([this.h - this.padding, this.padding]);
                this.y_scale_type = "log";
                this.y_scale_type_input.attr("value", "log");
                break;
        }
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(8)
            .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);
    };

    this.switch_y_scale_type = function() {
        switch (this.y_scale_type) {
            case "lin":
                this.set_y_scale_type("log");
                break;
            case "log":
                this.set_y_scale_type("lin");
                break;
        }
    };

    this.set_y_min = function(y_min) {
        this.y_min = parseFloat(y_min);
    };

    this.set_y_max = function(y_max) {
        this.y_max = parseFloat(y_max);
    };

    this.setup_svg = function() {
        this.xScale = d3.time.scale().range([this.padding_left, this.w - this.padding]);
        this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);


        var formatAsPercentage = d3.format(".1%");
        var timeFormat = d3.time.format("%X");

        this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(5)
                                  .tickSize(-(this.h - 2*this.padding), 0, 0)
                                  .tickPadding(8)
                                  .tickFormat(timeFormat);
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(8)
                                  .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);

        this.x_axis_dom = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.h - this.padding) + ")")
            .call(this.xAxis);

        this.y_axis_dom = this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.padding_left + ",0)")
            .call(this.yAxis);

        this.svg.selectAll('.domain')
            .attr('stroke', 'black')
            .attr('shape-rendering', 'crispEdges');



        this.lines = this.svg.append("g")
            .attr("class", "lines");
        this.points = this.svg.append("g")
            .attr("class", "points");

        this.line_of_attention = this.svg.append("line");

        this.line_func = d3.svg.line()
            .x(function(d) { return self.xScale(d.time); })
            .y(function(d) { return self.yScale(parseFloat(d.value)); });

    };

    this.parameter_setup = function(parameter_type) {
        this.lines.append("svg:path").attr("class", "line " + roy.tools.escaped(parameter_type));
    };

    this.parameter_teardown= function(parameter_type) {
    };

    this.refresh_parameter_list = function() {
        // Update the parameter selection menu
        this.parameter_selection.text("");
        window.parameter_types.forEach(function(parameter_type) {
            var js = "roy.toggle_parameter_type('" + self.id + "', '" + parameter_type + "');";
            var list_entry = self.parameter_selection.append("li");
            var checkbox = list_entry.append("input")
                .attr("type", "checkbox")
                .attr("id", self.id + parameter_type)
                .attr("onclick", js);
            if(roy.tools.includes(self.parameter_types, parameter_type)) {
                checkbox.property("checked", true);
            }
            var label = list_entry.append("label").attr("for", self.id + parameter_type);
            label.append("span"); // placeholder
            label.append("strong").text(parameter_type).style("color", roy.parameter_color(parameter_type));
        });
    };


    this.draw_lines = function() {
        // Draw the lines for each parameter_type
        this.parameter_types.forEach(function(parameter_type) {
            var data = self.data.filter(function(parameter){
                return parameter.type == parameter_type;
            });
            if (self.fill_enabled) {
                var min_value = d3.min(self.data, function(d) { return parseFloat(d.value); });
                var first = {'type': parameter_type, 'value': min_value, 'time': data[0].time};
                var last = {'type': parameter_type, 'value': min_value, 'time': data.slice(-1)[0].time};
                data = [first].concat(data, last);
            }
            self.lines.selectAll("." + roy.tools.escaped(parameter_type))
                  .data([data])
                  .attr("transform", "translate(0)")
                  .attr("d", self.line_func)
                  .attr("stroke", self.parameter_color(parameter_type))
                  .attr("fill", function(d) {
                      if (self.fill_enabled) {
                          return self.parameter_color(parameter_type);
                      } else {
                          return "none";
                      }
                  })
                  .on('mouseover', function(d) {
                      self.tooltip.text(parameter_type)
                          .style('opacity', 0.9)
                          .style('left', (d3.event.pageX - 190) + 'px')
                          .style('top', (d3.event.pageY - 60) + 'px');
                      d3.select(this).style("stroke-width", 3);
                  })
                  .on('mouseout', function(d) {
                      self.tooltip.style('opacity', 0.0);
                      d3.select(this).style("stroke-width", 1);
                  })
                  .transition()
                  .ease("linear")
                  .duration(self.smoothness)
                  .attr("transform", "translate(0)");
        });
    };


    this.draw_points = function() {
        // Draw the points for each parameter_type
        var points = this.points.selectAll("circle")
                      .data(this.data, function(d) { return d.time; });

        points.enter()
              .append("circle")
              .attr("cx", function(d) { return self.xScale(d.time); })
              .attr("cy", function(d) { return self.yScale(d.value); })
              .attr("r", 2)
              .attr("class", function(d) { return d.type; })
              .attr("fill", function(d) { return self.parameter_color(d.type); });

        points.transition()
              .duration(this.smoothness)
              .attr("cx", function(d) { return self.xScale(d.time); })
              .attr("cy", function(d) { return self.yScale(d.value); });

        points.exit()
              .transition()
              .duration(this.smoothness)
              .remove();
    };


    this.draw_axes = function() {
        // Update scales and draw the axes
        this.xScale.domain(d3.extent(self.data, function(d) { return d.time; }));
        //this.yScale.domain(d3.extent(self.data, function(d) { return parseFloat(d.value); }));
        var y_min = parseFloat(this.y_min) || d3.min(self.data, function(d) { return parseFloat(d.value) });
        var y_max = parseFloat(this.y_max) || d3.max(self.data, function(d) { return parseFloat(d.value) });
        this.yScale.domain([y_min, y_max]);
        this.yScale.clamp(false);

        this.svg.select(".x.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.xAxis);
        this.svg.select(".y.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.yAxis);

        this.svg.selectAll('.axis line')
            .style('stroke', 'lightgrey')
            .attr('shape-rendering', 'crispEdges')
            .attr('stroke-width', '1px')
            .attr('stroke-opacity', 1.0);
    };


    this.redraw = function() {
        this.fetch_data();
        this.draw_axes();
        if(this.points_enabled) {
            this.draw_points();
        }
        if(this.line_enabled) {
            this.draw_lines();
        }
        var units = [];
        self.parameter_types.forEach(function(parameter_type) {
            var unit = window.parameters[parameter_type][0].unit;
            if(!roy.tools.includes(units, unit)) {
                units.push(window.parameters[parameter_type][0].unit);
            }
        });
        self.y_label.text(units.join(', '));

        self.draw_line_of_attention();
    };



    this.init();
}

TimePlot.prototype = new Graph();


function Histogram() {
    var self = this;
    self.type = "histogram";

    this.setup = function() {
        this.smoothness = 100;
        this.nbins = 20;
        this.bar_spacing = 1; // pixels
        this.set_time_limit(600);
        self.y_scale_type = "lin";
        this.show_parameter_labels = false;

        this.settings_menu.append("div").append("span").text("Bins:");
        this.nbins_input = this.settings_menu.append("input")
            .attr("value", this.nbins)
            .on("input", function() {
                self.set_nbins(parseInt(this.value));
            });


        this.settings_menu.append('div').append('span').text('y-min:');
        this.y_min_input = this.settings_menu.append('input')
            .attr('value', this.y_min)
            .on('input', function() {
                self.set_y_min(this.value);
            });
        this.settings_menu.append('div').append('span').text('y-max:');
        this.y_max_input = this.settings_menu.append('input')
            .attr('value', this.y_max)
            .on('input', function() {
                self.set_y_max(this.value);
            });

        this.settings_menu.append("div").append("span").text("y-axis scale:");
        this.y_scale_type_input = this.settings_menu.append("input")
            .attr("value", this.y_scale_type)
            .attr("type", "submit")
            .on("click", function() {
                self.switch_y_scale_type();
                self.set_y_scale_type(this.value);
            });

        this.y_label.text("Count");
    };

    this.set_nbins = function(nbins) {
        if(nbins > 1 && nbins < 1000) {
            self.nbins = nbins;
            self.nbins_input.attr("value", nbins);
        }
    };

    this.set_x_min = function(x_min) {
        this.x_min = parseFloat(x_min);
    };

    this.set_x_max = function(x_max) {
        this.x_max = parseFloat(x_max);
    };

    this.set_y_min = function(y_min) {
        this.y_min = parseFloat(y_min);
    };

    this.set_y_max = function(y_max) {
        this.y_max = parseFloat(y_max);
    };


    this.setup_svg = function() {
        //this.reset_scales();
        this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
        this.xScale = d3.scale.linear().range([this.padding_left, this.w - this.padding]);

        this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(5)
            .tickSize(-(this.h - 2*this.padding), 0, 0)
            .tickPadding(8);
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(8)
            .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);

        this.x_axis_dom = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.h - this.padding) + ")")
            .call(this.xAxis);
        this.y_axis_dom = this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.padding_left + ",0)")
            .call(this.yAxis);

        this.x_axis_dom.selectAll('.domain')
            .attr('stroke', 'black')
            .attr('shape-rendering', 'crispEdges');

        this.y_axis_dom.selectAll('.domain')
            .attr('stroke', 'black')
            .attr('shape-rendering', 'crispEdges');

        this.bars = this.svg.append("g")
            .attr("class", "bars");

        this.line_of_attention = this.svg.append("line");
    };

    this.refresh_parameter_list = function() {
        // Update the parameter selection menu
        this.parameter_selection.text("");
        window.parameter_types.forEach(function(parameter_type) {
            var js = "roy.toggle_parameter_type('" + self.id + "', '" + parameter_type + "');";
            var list_entry = self.parameter_selection.append("li");
            var checkbox = list_entry.append("input")
                .attr("type", "checkbox")
                .attr("id", self.id + parameter_type)
                .attr("onclick", js);
            if(roy.tools.includes(self.parameter_types, parameter_type)) {
                checkbox.property("checked", true);
            }
            var label = list_entry.append("label").attr("for", self.id + parameter_type);
            label.append("span"); // placeholder
            label.append("strong").text(parameter_type).style("color", roy.parameter_color(parameter_type));
        });
    };


    this.set_y_scale_type = function(scale_type) {
        switch (scale_type) {
            case "lin":
                this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
                this.y_scale_type = "lin";
                this.y_scale_type_input.attr("value", "lin");
                break;
            case "log":
                this.yScale = d3.scale.log().range([this.h - this.padding, this.padding]);
                this.y_scale_type = "log";
                this.y_scale_type_input.attr("value", "log");
                break;
        }
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(8)
            .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);
    };

    this.switch_y_scale_type = function() {
        switch (this.y_scale_type) {
            case "lin":
                this.set_y_scale_type("log");
                break;
            case "log":
                this.set_y_scale_type("lin");
                break;
        }
    };


    this.draw_axes = function() {
        // Update scales and draw the axes

        var x_min = parseFloat(this.x_min) || d3.min(this.map);
        var x_max = parseFloat(this.x_max) || d3.max(this.map);
        this.xScale.domain(d3.extent([x_min, x_max]));
        if (this.y_scale_type == 'lin') {
            var y_min = parseFloat(this.y_min) || 0;
            var y_max = parseFloat(this.y_max) || d3.max(this.histogram, function(d) { return d.length; });
            if (y_min < 0) {
                y_min = 1;
            }
            if (y_max < y_min) {
                y_max = y_min + 1;
            }
            this.yScale.domain([y_min, y_max]);
        }
        if (this.y_scale_type == 'log') {
            var y_min = parseFloat(this.y_min) || 1;
            var y_max = parseFloat(this.y_max) || d3.max(this.histogram, function(d) { return d.length; });
            if (y_min < 1) {
                y_min = 1;
            }
            if (y_max < y_min) {
                y_max = y_min + 1;
            }
            this.yScale.domain([y_min, y_max]);
        }

        this.yScale.clamp(true);

        this.svg.select(".x.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.xAxis);
        this.svg.select(".y.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.yAxis)

        this.svg.selectAll('.axis line')
            .style('stroke', 'lightgrey')
            .attr('shape-rendering', 'crispEdges')
            .attr('stroke-width', '1px')
            .attr('stroke-opacity', 1.0);
    };

    this.histo_y = function(d) {
        if (d.y < 1) {
            return this.h - this.padding;
        } else {
            return self.yScale(d.y);
        }
    }

    this.histo_height = function(d) {
        if (d.y < 1 || self.xScale(d.x) < this.padding_left)  {
            return 0;
        } else {
            return (this.h - this.padding - self.yScale(d.y));
        }
    }

    this.draw_bars = function() {
        // Draw the bars for each parameter_type
        var bars = this.bars.selectAll("rect")
            .data(this.histogram, function(d, i) { return i; });

        var bar_width = (self.w - self.padding_left - self.padding) / self.nbins - self.bar_spacing;
        if (bar_width < 1) {
            bar_width = 1;
        }

        bars.enter()
            .append("rect")
            .attr("x", function(d) { return self.xScale(d.x); })
            .attr("y", function(d) { return self.histo_y(d); })
            .attr("width", bar_width)
            .attr("height", function(d) { return self.histo_height(d); })
            //.attr("class", function(d) { return d.type; })
            //.attr("fill", function(d) { return self.parameter_color(d.type); });
            .attr("fill", "#2688D3")
            .on('mouseover', function(d) {
                d3.select(this).attr('fill', '#FF5179');
                //d3.select(this).style('opacity', 0.5);
                self.tooltip.text(d.y)
                    .style('opacity', 0.9)
                    .style('left', (d3.event.pageX - 190) + 'px')
                    .style('top', (d3.event.pageY - 60) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', '#2688D3');
                //d3.select(this).style('opacity', 1.0);
                self.tooltip.style('opacity', 0.0);
            })
            .on('click', function() {
            });

        bars.transition()
            .duration(this.smoothness)
            .attr("x", function(d) { return self.xScale(d.x); })
            .attr("y", function(d) { return self.histo_y(d); })
            .attr("width", bar_width)
            .attr("height", function(d) { return self.histo_height(d); });

        bars.exit()
            .transition()
            .duration(this.smoothness)
            .remove();
    };

    this.redraw = function() {
        this.fetch_data();
        this.map = self.data.map(function(i) {
            return parseFloat(i.value);
        });
        this.histogram = d3.layout.histogram().bins(this.nbins)(this.map);
        this.draw_axes();
        this.draw_bars();

        var units = [];
        self.parameter_types.forEach(function(parameter_type) {
            var unit = window.parameters[parameter_type][0].unit;
            if(!roy.tools.includes(units, unit)) {
                units.push(window.parameters[parameter_type][0].unit);
            }
        });
        self.x_label.text(units.join(', '));
        self.draw_line_of_attention();
    };


    this.init();
}

Histogram.prototype = new Graph();


function Equaliser() {
    var self = this;
    self.type = "equaliser";

    this.setup = function() {
        this.smoothness = 100;
        this.bar_spacing = 1; // pixels
        this.set_time_limit(600);
        self.y_scale_type = "lin";
        this.y_label.text('');
        self.x_label.text('Parameters');

        this.settings_menu.append('div').append('span').text('y-min:');
        this.y_min_input = this.settings_menu.append('input')
            .attr('value', this.y_min)
            .on('input', function() {
                self.set_y_min(this.value);
            });
        this.settings_menu.append('div').append('span').text('y-max:');
        this.y_max_input = this.settings_menu.append('input')
            .attr('value', this.y_max)
            .on('input', function() {
                self.set_y_max(this.value);
            });

        this.settings_menu.append("div").append("span").text("y-axis scale:");
        this.y_scale_type_input = this.settings_menu.append("input")
            .attr("value", this.y_scale_type)
            .attr("type", "submit")
            .on("click", function() {
                self.switch_y_scale_type();
                self.set_y_scale_type(this.value);
            });
    };


    this.set_y_scale_type = function(scale_type) {
        switch (scale_type) {
            case "lin":
                this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
                this.y_scale_type = "lin";
                this.y_scale_type_input.attr("value", "lin");
                break;
            case "log":
                this.yScale = d3.scale.log().range([this.h - this.padding, this.padding]);
                this.y_scale_type = "log";
                this.y_scale_type_input.attr("value", "log");
                break;
        }
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(8)
            .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);
    };

    this.switch_y_scale_type = function() {
        switch (this.y_scale_type) {
            case "lin":
                this.set_y_scale_type("log");
                break;
            case "log":
                this.set_y_scale_type("lin");
                break;
        }
    };


    this.set_y_min = function(y_min) {
        this.y_min = parseFloat(y_min);
    };

    this.set_y_max = function(y_max) {
        this.y_max = parseFloat(y_max);
    };


    this.setup_svg = function() {
        //this.reset_scales();
        this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
        this.xScale = d3.scale.linear().range([this.padding_left, this.w - this.padding]);

        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(8)
            .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);

        this.y_axis_dom = this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.padding_left + ",0)")
            .call(this.yAxis);

        this.y_axis_dom.selectAll('.domain')
            .attr('stroke', 'black')
            .attr('shape-rendering', 'crispEdges');

        this.bars = this.svg.append("g")
            .attr("class", "bars");

        this.line_of_attention = this.svg.append("line");
    };

    this.refresh_parameter_list = function() {
        // Update the parameter selection menu
        this.parameter_selection.text("");
        window.parameter_types.forEach(function(parameter_type) {
            var js = "roy.toggle_parameter_type('" + self.id + "', '" + parameter_type + "');";
            var list_entry = self.parameter_selection.append("li");
            var checkbox = list_entry.append("input")
                .attr("type", "checkbox")
                .attr("id", self.id + parameter_type)
                .attr("onclick", js);
            if(roy.tools.includes(self.parameter_types, parameter_type)) {
                checkbox.property("checked", true);
            }
            var label = list_entry.append("label").attr("for", self.id + parameter_type);
            label.append("span"); // placeholder
            label.append("strong").text(parameter_type).style("color", roy.parameter_color(parameter_type));
        });
    };



    this.draw_axes = function() {
        // Update scales and draw the axes
        this.xScale.domain([0, self.data.length]);
        //this.yScale.domain(d3.extent(self.data, function(d) { return parseFloat(d.value); }));

        var y_min = parseFloat(this.y_min) || d3.min(self.data, function(d) { return parseFloat(d.value) });
        var y_max = parseFloat(this.y_max) || d3.max(self.data, function(d) { return parseFloat(d.value) });
        this.yScale.domain([y_min, y_max]);
        this.yScale.clamp(true);

        this.svg.select(".y.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.yAxis)

        this.svg.selectAll('.axis line')
            .style('stroke', 'lightgrey')
            .attr('shape-rendering', 'crispEdges')
            .attr('stroke-width', '1px')
            .attr('stroke-opacity', 1.0);
    };

    this.bar_y = function(d) {
        if (d.value < 1) {
            return this.h - this.padding;
        } else {
            return self.yScale(d.value);
        }
    }

    this.bar_height = function(d) {
        if (d.value < 1) {
            return 0;
        } else {
            return (this.h - this.padding - self.yScale(d.value));
        }
    }

    this.draw_bars = function() {
        // Draw the bars for each parameter_type
        var bars = this.bars.selectAll("rect")
            .data(this.data, function(d, i) { return i; });

        var bar_width = (self.w - self.padding_left - self.padding) / self.data.length - self.bar_spacing;
        if (bar_width < 1) {
            bar_width = 1;
        }

        bars.enter()
            .append("rect")
            .attr("x", function(d, i) { return self.xScale(i); })
            .attr("y", function(d) { return self.bar_y(d); })
            .attr("width", bar_width)
            .attr("height", function(d) { return self.bar_height(d); })
            .attr("fill", function(d) { return self.parameter_color(d.type); })
            .on('mouseover', function(d) {
                d3.select(this).style('opacity', 0.8);
                self.tooltip.text(d.type)
                    .style('opacity', 1.0)
                    .style('left', (d3.event.pageX - 190) + 'px')
                    .style('top', (d3.event.pageY - 60) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).style('opacity', 1.0);
                self.tooltip.style('opacity', 0.0);
            });

        bars.transition()
            .duration(this.smoothness)
            .attr("x", function(d, i) { return self.xScale(i); })
            .attr("y", function(d) { return self.bar_y(d); })
            .attr("width", bar_width)
            .attr("height", function(d) { return self.bar_height(d); })
            .attr("fill", function(d) { return self.parameter_color(d.type); });
        bars.exit()
            .transition()
            .duration(this.smoothness)
            .remove();
    };

    this.redraw = function() {
        this.fetch_data();
        this.draw_axes();
        this.draw_bars();

        var units = [];
        self.parameter_types.forEach(function(parameter_type) {
            var unit = window.parameters[parameter_type][0].unit;
            if(!roy.tools.includes(units, unit)) {
                units.push(window.parameters[parameter_type][0].unit);
            }
        });
        self.y_label.text(units.join(', '));
        self.draw_line_of_attention();
    };

    this.fetch_data = function() {
        var data = [];
        var self = this;
        this.parameter_types.forEach(function(parameter_type) {
            var parameter_data = window.parameters[parameter_type];
            if (parameter_data) {
                var last_parameter_data = parameter_data.slice(-1)[0]
                data = data.concat(last_parameter_data);
            }
        });
        this.data = data;
    };

    this.init();
}

Equaliser.prototype = new Graph();
