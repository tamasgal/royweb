test( "Graph", function(assert) {
	window.graphs = [];
	window.parameter_types = [];
	graph_1 = new TimePlot();
	graph_2 = new Histogram();
	ok(graph_1.id != graph_2.id, "The IDs of two graphs should be different");
});

test( "TimePlot", function(assert) {
	window.graphs = [];
	window.parameter_types = [];
	var time_plot = new TimePlot();
	ok(window.graphs[0] === time_plot, "TimePlot instance is in window.graphs when initialising");
});

test( "Histogram", function(assert) {
	window.graphs = [];
	window.parameter_types = [];
	var histogram = new Histogram();
	ok(window.graphs[0] === histogram, "Histogram instance is in window.graphs when initialising");
});

test( "Equaliser", function(assert) {
	window.graphs = [];
	window.parameter_types = [];
	var equaliser = new Equaliser();
	ok(window.graphs[0] === equaliser, "Equaliser instance is in window.graphs when initialising");
});