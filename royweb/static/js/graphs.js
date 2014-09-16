function Graph() {
    // A graph, which automatically adds itself to the content-DIV
    var self = {};

    self.id = roy.tools.guid_alt();


    self.w = 450;
    self.h = 200;
    self.padding = 25;
    self.padding_left = 50;
    self.smoothness = 0; // transition time in ms

    self.div = d3.select("#content").append("div").attr("class", "graph");
    self.title_field = self.div.append("h2");
    self.parameter_selection = self.div.append("ul")
                                   .attr("class", "parameter_selection");
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


    self.parameter_types = [];
    self.register_parameter_type = function(parameter_type) {
        if(!roy.tools.includes(self.parameter_types, parameter_type)) {
            self.parameter_types.push(parameter_type);
            self.lines.append("svg:path").attr("class", "line " + parameter_type);
        }
    }

    self.unregister_parameter_type = function(parameter_type) {
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
        var data = [];
        self.parameter_types.forEach(function(parameter_type) {
            data = data.concat(window.parameters[parameter_type]);
        });
        return data;
    }
    self.data = self.fetch_data();



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
        self.data = self.fetch_data();
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
              .attr("class", function(d) {
                  return d.type;
              })
              .attr("fill", function(d) {
                  if(d.type == "foo") {
                      return "#268BD3";
                  } else if (d.type == "narf") {
                      return "#ffffff";
                  }
              });


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

        self.parameter_types.forEach(function(parameter_type) {
            self.lines.selectAll("." + parameter_type)
                  .data([window.parameters[parameter_type]])
                  //.attr("transform", "translate(" + -slide_px + ")")
                  .attr("transform", "translate(0)")
                  .attr("d", self.line_func)
                  //.attr("class", parameter_type+"_line")
                  .transition()
                  .ease("linear")
                  .duration(self.smoothness)
                  .attr("transform", "translate(0)");
        });
    }

    window.graphs.push(self);
    self.refresh_parameter_list();
    return self;
}

