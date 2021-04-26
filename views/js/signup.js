$(document).ready(function(){

    $( "#signup" ).submit(function(event) {
        event.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/signup',
            data: $('#signup').serialize(),
            dataType: "json",
            success: function(response){
                //alert("a");
                //console.log(response.Success);
                $('#signup')[0].reset();
                 },
                 error: function() {
                 }
             })
    });
});