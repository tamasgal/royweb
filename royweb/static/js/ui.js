$( document ).ready(function() {
    $(".window_title").parent().toggleClass( "minimized_window", 200);

    $( ".window_title" ).on("click", function() {
        $(this).parent().toggleClass( "minimized_window", 200);
    });

});

