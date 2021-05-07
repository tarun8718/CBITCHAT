function myFunction() {
    console.log("IN myFunction");
    // Get the checkbox
    var checkBox = document.getElementById("myCheck");
    // Get the output text
    var text = document.getElementById("pswd");
  
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
}

$(document).ready(function(){

    $( "#newroom" ).submit(function(event) {
        event.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/createroom',
            data: $('#newroom').serialize(),
            dataType: "json",
            success: function(response){
                //alert("a");
                //console.log(response.Success);
                $('#newroom')[0].reset();
                document.getElementById("check").innerHTML=response.Success;
                 
                setTimeout(function(){
                    document.getElementById("check").innerHTML="";
                },3000);

                if (response.Success=="New room built.") {
                    document.getElementById("aa").click();
                };
                 },
                 error: function() {
                 }
             })
    });
});