var roy = {
    tools: {
        includes: function(arr, obj) {
            return (arr.indexOf(obj) != -1);
        },
        timestamp: function() {
            // Return the unix timestamp with milliseconds accuracy.
            return +new Date();
        },
        guid_alt: function() {
            // Generate a unique ID
            function s4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
                           .toString(16)
                           .substring(1);
            }
            return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };
        },
        guid: function() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
        escaped: function(string) {
            // Escapes . with _ to be able to use it as HTML-id
            return string.replace(/\./g,'_')
        },
        color: function(i) {
            var scale = chroma.scale('Dark2');
            var color = scale(0.05 * (i % 20)).hex();
            return color;
        }
    },
    ui: {
        toggle_menu: function() {
            //<D-r>$('#sidebar').height(20);
        }
    },
    parameter_color: function(parameter_type) {
        // assign color according to index in global parameter_types
        var index = window.parameter_types.indexOf(parameter_type);
        return roy.tools.color(index);
    },
    toggle_parameter_type: function(graph_id, parameter_type) {
        window.graphs.forEach(function(graph) {
            if(graph.id == graph_id) {
                graph.toggle_parameter_type(parameter_type);
                graph.redraw();
            }
        });
    },
    close_graph: function(graph_id) {
        window.graphs.forEach(function(graph) {
            if(graph.id == graph_id) {
                graph.close();
            }
        });
    },
    export_graph: function(graph_id) {
        window.graphs.forEach(function(graph) {
            if(graph.id == graph_id) {
                //get svg element.
                var title_field = d3.select('#svg' + graph.id)
                     .append("text")
                     .attr("x", (graph.w / 2))
                     .attr("y", 0 + (graph.padding / 2))
                     .attr("text-anchor", "middle")
                     .style("font-size", "14px")
                     .attr("fill", "#268BD3")
                     .text(graph.get_title());

                var svg = document.getElementById('svg' + graph_id);

                //get svg source.
                var serializer = new XMLSerializer();
                var source = serializer.serializeToString(svg);

                //add name spaces.
                if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
                }
                if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
                }

                //add xml declaration
                source = '<?xml version="1.0" standalone="yes"?>\r\n' + source;

                //convert svg source to URI data scheme.
                var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
                document.getElementById('export_button' + graph_id).href = url;

                title_field.remove();
            }
        });
    },
    save_session: function() {
        var session_name = prompt("Please enter a name for the session.", "");
        if (session_name != null) {
            console.log("Saving session \"" + session_name + "\"");
            var json_data = {};
            json_data['kind'] = "session_save";
            json_data['session_name'] = session_name;
            json_data['graphs'] = [];
            window.graphs.forEach(function(graph) {
                var graph_data = {};
                graph_data['title'] = graph.get_title();
                graph_data['type'] = graph.type;
                if (graph.type == "histogram") {
                    graph_data['nbins'] = graph.nbins;
                }
                graph_data['time_limit'] = graph.time_limit;
                graph_data['y_scale_type'] = graph.y_scale_type;
                graph_data['parameter_types'] = graph.parameter_types;
                graph_data['width'] = graph.w;
                graph_data['height'] = graph.h;
                graph_data['line_of_attention'] = graph.line_of_attention_value;
                json_data['graphs'].push(graph_data);
                console.log("Saving " + graph.type);
            });
            console.log(json_data);
            ws.send(JSON.stringify(json_data));
        }
    },
    load_session: function(session_name) {
        var json_data = {};
        json_data['kind'] = 'session_load';
        json_data['session_name'] = session_name;
        ws.send(JSON.stringify(json_data));
    },
    clear_session: function() {
        window.graphs = [];
        d3.select("#content").text('');
    }
};

Array.prototype.longest=function() {
    return this.sort(
      function(a,b) {
        if (a.length > b.length) return -1;
        if (a.length < b.length) return 1;
          return 0
      }
    )[0];
}
