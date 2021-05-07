$(document).ready(function(){

    $( "#signin" ).submit(function(event) {
        event.preventDefault();
        console.log("HIIIIIIIIIIIIIIIIIIIII");

        $.ajax({
            type: 'POST',
            url: '/',
            data: $('#signin').serialize(),
            dataType: "json",
            success: function(response){
                //alert("a");
                console.log("SUCCESS!!!!!!!");
                $('#signin')[0].reset();

                document.getElementById("check").innerHTML=response.Success;
                 
                setTimeout(function(){
                    document.getElementById("check").innerHTML="";
                },3000);

                if (response.Success=="Success!") {
                    document.getElementById("aa").click();
                };
            },
                 error: function() {
                     console.log("****ERROR*********");
                 }
             })
        
    });
});