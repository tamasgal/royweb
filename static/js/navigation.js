$( document ).ready(function() {
    $( "#run_unit_tests" ).on("click", function() {
        $( "#content" ).html("<iframe src=\"/static/UnitTests.html\"></iframe></div>");
    });
    $( "#run_spec_tests" ).on("click", function() {
        $( "#content" ).html("<iframe src=\"/static/SpecTests.html\"></iframe></div>");
    });

});
