test( "roy.tools.includes", function(assert) {
	var array = Array(1, 2, 3);
    ok( roy.tools.includes(array, 1), "1 is in array" );
    ok( roy.tools.includes(array, 2), "2 is in array!" );
    ok( roy.tools.includes(array, 3), "3 is in array!" );
    ok( !roy.tools.includes(array, 4), "4 is not in array!" );
});

test( "roy.tools.escaped", function() {
	var a_string = "foo.bar";
	equal('foo_bar', roy.tools.escaped(a_string), "Replaces . within word");
	var b_string = "foo.";
	equal('foo_', roy.tools.escaped(b_string), "Replaces . at the end of word");
	var c_string = ".foo";
	equal('_foo', roy.tools.escaped(c_string), "Replaces . at the beginning of word");
	var d_string = "foo...bar";
	equal('foo___bar', roy.tools.escaped(d_string), "Replaces multiple dots");
});
