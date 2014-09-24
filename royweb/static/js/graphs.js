function Graph() {
    // The one and only Graph. Use it only for prototypes!

    this.init = function() {
        this.id = roy.tools.guid();
        this.time_limit = 180; // max time offset of parameter to show
        this.w = 450;
        this.h = 220;
        this.padding = 25;
        this.padding_left = 50;
        this.smoothness = 0; // transition time in ms. Not ready yet

        this.setup_html();
        this.setup_svg();
        this.setup_menu();
        this.setup();

        window.graphs.push(this);
        this.parameter_types = [];
        this.set_title("Untitled");
        this.refresh_parameter_list();
    };

    this.setup = function() {};

    this.set_title = function(title) {
        // Update the H2 field of the graph.
        this.title_field.attr("value", title);
    };

    this.get_title = function() {
        return this.title_field[0][0].value; // WHY??
    };

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
            .attr("id", this.id);
    };

    this.close = function() {
        var index = window.graphs.indexOf(this);
        if (index > -1) {
            window.graphs.splice(index, 1);
            this.div.remove();
        }
    };



    this.setup_menu = function() {
        var graph_div = this.menu_div.append("div").attr("class", "menu_item");
        var js = "roy.close_graph('" + this.id + "');";
        graph_div.append("h3").text("Graph");
        graph_div.append("div").attr("class", "menu_button").append("a").text("Close")
            .attr("onclick", js);

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
    };

    this.fetch_data = function() {
        // Get the parameter data for the last this.time_limit seconds
        var data = [];
        this.parameter_types.forEach(function(parameter_type) {
            var parameter_data = window.parameters[parameter_type];
            var filtered_data = parameter_data.filter(function(parameter) {
                return (parameter.time > (new Date().getTime()) - self.time_limit*1000);
            });
            data = data.concat(filtered_data);
        });
        this.data = data;
    };

    this.parameter_setup = function() { };

    this.register_parameter_type = function(parameter_type) {
        // Add parameter_type to the monitored ones and setup the SVG
        if(!roy.tools.includes(this.parameter_types, parameter_type)) {
            this.parameter_types.push(parameter_type);
            this.parameter_setup(parameter_type);
        }
    };

    this.unregister_parameter_type = function(parameter_type) {
        // Delete parameter_type from the monitored ones and cleanup the SVG
        var index = this.parameter_types.indexOf(parameter_type);
        this.parameter_types.splice(index, 1);
        this.svg.selectAll("."+parameter_type).remove();
        this.parameter_teardown(parameter_type);
    };

    this.toggle_parameter_type = function(parameter_type) {
        if(!roy.tools.includes(this.parameter_types, parameter_type)) {
            this.register_parameter_type(parameter_type);
        } else {
            this.unregister_parameter_type(parameter_type);
        }
    };

    this.resize = function(width, height) {
        // Change the width and height of the SVG container.
        this.svg.attr("width", width).attr("height", height);
    };

    this.parameter_color = function(parameter_type) {
        // assign color according to index in global parameter_types
        var index = window.parameter_types.indexOf(parameter_type);
        return roy.tools.color(index);
    };
}


function TimePlot() {
    // A graph, which automatically adds itself to the content-DIV
    // a = typeof a !== 'undefined' ? a : 42;

    var self = this;
    self.type = "timeplot";

    this.setup_svg = function() {
        this.xScale = d3.time.scale().range([this.padding_left, this.w - this.padding]);
        this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);

        var formatAsPercentage = d3.format(".1%");
        var timeFormat = d3.time.format("%X");

        this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(5)
                                  .tickSize(-(this.h - 2*this.padding), 0, 0)
                                  .tickPadding(8)
                                  .tickFormat(timeFormat);
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(5)
                                  .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.h - this.padding) + ")")
            .call(this.xAxis);
        this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.padding_left + ",0)")
            .call(this.yAxis);

        this.lines = this.svg.append("g")
            .attr("class", "lines");
        this.points = this.svg.append("g")
            .attr("class", "points");

        this.line_func = d3.svg.line()
            .x(function(d) { return self.xScale(d.time); })
            .y(function(d) { return self.yScale(d.value); });
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
            label.append("strong").text(parameter_type);
        });
    };


    this.draw_lines = function() {
        // Draw the lines for each parameter_type
        this.parameter_types.forEach(function(parameter_type) {
            var data = self.data.filter(function(parameter){
                return parameter.type == parameter_type;
            });
            var min_value = d3.min(self.data, function(d) { return d.value; });
            var first = {'type': parameter_type, 'value': min_value, 'time': data[0].time};
            var last = {'type': parameter_type, 'value': min_value, 'time': data.slice(-1)[0].time};
            data = [first].concat(data, last);
            self.lines.selectAll("." + roy.tools.escaped(parameter_type))
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
        this.yScale.domain(d3.extent(self.data, function(d) { return d.value; }));

        this.svg.select(".x.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.xAxis);
        this.svg.select(".y.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.yAxis)
    };


    this.redraw = function() {
        this.fetch_data();
        this.draw_axes();
        this.draw_points();
        this.draw_lines();
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
        this.y_scale_type = "linear";

        this.settings_menu.append("div").append("span").text("Bins:");
        this.settings_menu.append("input").attr("value", this.nbins).on("input", function() {
            var value = parseInt(this.value);
            if(value > 1 && value < 1000) {
                self.nbins = value;
            }
        });
    };

    this.reset_scales = function() {
        switch (this.y_scale_type) {
            case "linear":
                this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
                break;
            case "log":
                this.yScale = d3.scale.log().range([this.h - this.padding, this.padding]);
                break;
        }
        this.xScale = d3.scale.linear().range([this.padding_left, this.w - this.padding]);
    };

    this.setup_svg = function() {
        //this.reset_scales();
        this.yScale = d3.scale.linear().range([this.h - this.padding, this.padding]);
        this.xScale = d3.scale.linear().range([this.padding_left, this.w - this.padding]);

        this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(5)
            .tickSize(-(this.h - 2*this.padding), 0, 0)
            .tickPadding(8);
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(5)
            .tickSize(-(this.w - this.padding - this.padding_left), 0, 0);

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.h - this.padding) + ")")
            .call(this.xAxis);
        this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.padding_left + ",0)")
            .call(this.yAxis);

        this.bars = this.svg.append("g")
            .attr("class", "bars");
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
            label.append("strong").text(parameter_type);
        });
    };

    this.draw_axes = function() {
        // Update scales and draw the axes
        this.xScale.domain(d3.extent(this.map));
        this.yScale.domain([1, d3.max(this.histogram, function(d) { return d.length; })]).nice();

        this.svg.select(".x.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.xAxis);
        this.svg.select(".y.axis")
            .transition()
            .duration(this.smoothness)
            .call(this.yAxis)
    };

    this.draw_bars = function() {
        // Draw the bars for each parameter_type
        var bars = this.bars.selectAll("rect")
            .data(this.histogram, function(d, i) { return i; });

        var bar_width = (self.w - self.padding_left - self.padding) / self.nbins - self.bar_spacing;

        bars.enter()
            .append("rect")
            .attr("x", function(d) { return self.xScale(d.x); })
            .attr("y", function(d) { return self.yScale(d.y); })
            .attr("width", bar_width)
            .attr("height", function(d) { return (self.yScale(0) - self.yScale(d.y)); })
            //.attr("class", function(d) { return d.type; })
            //.attr("fill", function(d) { return self.parameter_color(d.type); });
            .attr("fill", "#2688D3");

        bars.transition()
            .duration(this.smoothness)
            .attr("x", function(d) { return self.xScale(d.x); })
            .attr("y", function(d) { return self.yScale(d.y); })
            .attr("width", bar_width)
            .attr("height", function(d) { return (self.yScale(0) - self.yScale(d.y)); });

        bars.exit()
            .transition()
            .duration(this.smoothness)
            .remove();
    };

    this.redraw = function() {
        this.fetch_data();
        this.map = self.data.map(function(i) { return i.value; });
        this.histogram = d3.layout.histogram().bins(this.nbins)(this.map);
        this.draw_axes();
        this.draw_bars();
    };


    this.init();
}

Histogram.prototype = new Graph();

