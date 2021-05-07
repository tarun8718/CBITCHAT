const socket = io();

socket.emit('getRooms');

var roomdata;

async function storedat(data) {
    roomdata = data;
    console.log("Inside Store data");
    console.log(roomdata);
    document.getElementById("roomselect").onchange = function () {
        var x = document.getElementById("roomselect").value;
        for(i=0;i<roomdata.length;i++)
        {
            if ( roomdata[i].roomname === x) {
                console.log("Found data");
                if (roomdata[i].status === 'Private') {
                    document.getElementById('pwd').removeAttribute('style');
                }
                else {
                    document.getElementById('pwd').setAttribute('style', 'display: none;');
                }
            }

        }
    }
}

socket.on("InitRooms",(data) => {
    console.log("*****Inside Rooms")
    console.log(data);
    roomdata = data;
    storedat(data);
    for(i=0;i<data.length;i++)
    {
        const option = document.createElement('option');
        option.value=data[i].roomname;
        option.innerHTML = `${data[i].roomname}`;
        document.querySelector('.RoomNames').appendChild(option);
    }

    
});


$(document).ready(function(){


    $( "#Rooms" ).submit(function(event) {
        event.preventDefault();
        console.log("Inside Rooms Client js");

        $.ajax({
            type: 'POST',
            url: '/rooms',
            data: $('#Rooms').serialize(),
            dataType: "json",
            success: function(response){
                alert("a");
                console.log("SUCCESS!!!!!!!");
                $('#Rooms')[0].reset();

                document.getElementById("check").innerHTML=response.Success;
                 
                setTimeout(function(){
                    document.getElementById("check").innerHTML="";
                },3000);

                if (response.Success=="Success!") {
                    document.getElementById("aa").click();
                };
            },
                 error: function (request, status, error) {
                     console.log("ERROR");
                     console.log(request.responseText);

                    alert(request.responseText);
                }
             })
        
    });
});