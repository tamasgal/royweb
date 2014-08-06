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
        }
    },
    narf: {
        ajax_method: function() {}
    },
    some_method: function() {}
};
