

//var serverURL = "http://restclass.azurewebsites.net/API/";
var serverURL = "http://localhost:8080/api/"

//an object constructor
function Message(firstName, surname, email, password, age, message) {
    this.firstName = firstName;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.age = age;
    this.message = message;
    this.user = "Sandie";
}

function clearForm() {
    $("#firstName").val("");
    $("#surname").val("");
    $("#email").val("");
    $("#password").val("");
    $("#age").val("");
    $("#message").val("");
}

function saveMessage() {
    //get the values
    console.log("Saving");
    var firstName = $("#firstName").val();
    var surname = $("#surname").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var age = $("#age").val();
    var message = $("#message").val();


    //create an object
    //this is one object with 7 attributes

    var theMessage = new Message(firstName, surname, email, password, age, message);
    console.log(theMessage);

    var jsonString = JSON.stringify(theMessage);
    console.log(jsonString);

    //send the object to the server
    $.ajax({
        url: serverURL + "messages",
        type: "POST",
        data: jsonString,
        contentType: "application/json",
        success: function (response) {

            console.log("Yay, it works!", response);

            //clear the items
            clearForm();

            //show notification
            $("#alertSuccessContact").removeClass("hidden");
            //setTimeout fn and miliseconds
            setTimeout(function () {
                $("#alertSuccessContact").addClass("hidden");
            }, 3000);
        },
        error: function (errorDetails) {
            console.log("Error:", errorDetails);
        }
    });
}




function init() {
    console.log("This is the Contact Page!!");

    //used to retrieve the initial data
    //hook events
    $("#btnSaveMessage").click(saveMessage);
}

window.onload = init;
