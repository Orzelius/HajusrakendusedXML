$(document).ready(function(){

    var element = $('meta[name="active-menu"]').attr('content');
    $('#' + element).addClass('active');
});

$( "td" ).hover(
    function() {
      $( this ).addClass( "hover" );
    }, function() {
      $( this ).removeClass( "hover" );
    }
);