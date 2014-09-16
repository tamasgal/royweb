var roy = {
    tools: {
        includes: function(arr, obj) {
            return (arr.indexOf(obj) != -1);
        },
        timestamp: function() {
            // Return the unix timestamp with milliseconds accuracy.
            return +new Date();
        },
        guid: function() {
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
        guid_alt: function() {
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
        color: function(i) {
            // http://tools.medialab.sciences-po.fr/iwanthue/
            var colors = ["#315E88", "#CE26A3", "#36B136", "#0B3272",
                          "#8C1E0B", "#445809", "#70095B", "#F5750A",
                          "#78B4B0", "#8F95FD", "#FB6D74", "#C4AB68",
                          "#4F373E", "#9E6613", "#A27B90", "#E5689F",
                          "#01687A", "#BDA1DA", "#D0B53B", "#59CEAB",
                          "#601D3C", "#4D419A"];
            return colors[i];
        }
    },
    narf: {
        ajax_method: function() {}
    },
    toggle_parameter_type: function(graph_id, parameter_type) {
        window.graphs.forEach(function(graph) {
            if(graph.id == graph_id) {
                graph.toggle_parameter_type(parameter_type);
            }
        });
    }
};
